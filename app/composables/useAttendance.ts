import SuccessModal from "~/components/modals/SuccessModal.vue";
import type { Database } from "~/types/database";

export const useAttendance = async () => {
  const client = useSupabaseClient<Database>();
  const name = useState<string>("attendance_name", () => "");
  const dob = useState<number | null>("attendance_dob", () => null);
  const gender = useState<string>("attendance_gender", () => "");
  const message = useState<string>("attendance_message", () => "");
  const records = useState<any[]>("attendance_records", () => []);
  const gName = useState<string>("attendance_gName", () => "");
  const gContact = useState<string>("attendance_gContact", () => "");
  const selectedRecord = useState<string | undefined>("attendance_selectedRecord", () => undefined);
  const processing = ref<boolean>(false)

  // composable imports
  const { showModal, generateAvatar } = useCommon()

  const getAttendance = async () => {
    const { data, error } = await client
      .from("attendance")
      .select("*")
      .order("checkin_time", { ascending: false });

    if (error) throw error;
    return data;
  };

  const getRecords = async () => {
    const { data, error } = await client.from("kids").select("*");

    if (error) throw error;
    records.value = data;
    return data;
  };

  const addKid = async () => {
    processing.value = true
    const { error } = await client
      .from("kids")
      .insert([
        { 
          full_name: name.value, 
          dob: dob.value, 
          gender: gender.value,
          avatar_url: generateAvatar({name: name.value, gender: gender.value}),
          guardian_name: gName.value,
          guardian_contact: gContact.value
        },
      ]);

    message.value = error ? "Error adding kid" : "Kid added successfully";
    if (!error) {
      name.value = "";
      dob.value = null;
      gender.value = "";
      gName.value = "";
      gContact.value = ""
    }
    await getRecords()
    processing.value = false
    showModal(SuccessModal, {message})
  };

  const editKid = async (kid_id: string) => {
    if (!kid_id) {
      message.value = "Error: No ID provided for edit";
      return;
    }
    processing.value = true
    let errorInstance: any = null;
    try {
      const { error } = await client
        .from("kids")
        .update({
          full_name: name.value,
          dob: dob.value,
          gender: gender.value,
          avatar_url: generateAvatar({name: name.value, gender: gender.value}),
          guardian_name: gName.value,
          guardian_contact: gContact.value
        })
        .eq("id", kid_id);

      errorInstance = error;
      message.value = error ? "Error editing kid" : "Kid updated successfully";
      await getRecords();
      showModal(SuccessModal, {message})

      if (!error) {
        name.value = "";
        dob.value = null;
        gender.value = "";
        gName.value = "";
        gContact.value = "";
      }
    } catch (err: any) {
      errorInstance = err;
      message.value = `Error editing kid: ${err?.message || err}`;
      // showModal(SuccessModal, {message});
    } finally {
      processing.value = false;
    }
  };

  const deleteKid = (kid_id: string) => {
    if (!kid_id) {
      message.value = "Error: No ID provided for delete";
      return;
    }
    processing.value = true
    client
      .from("kids")
      .delete()
      .eq("id", kid_id)
      .then(({ error }) => {
        message.value = error ? "Error deleting kid" : "Successfully deleted kid!";
        getRecords();
        processing.value = false
        showModal(SuccessModal, {message})
      });
  }

  return {
    name,
    dob,
    gender,
    message,
    records,
    gName,
    gContact,
    selectedRecord,
    processing,
    getAttendance,
    getRecords,
    addKid,
    editKid,
    deleteKid
  };
};
