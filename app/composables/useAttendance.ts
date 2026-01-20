import SuccessModal from "~/components/modals/SuccessModal.vue";
import type { Database } from "~/types/database";

export const useAttendance = async () => {
  const client = useSupabaseClient<Database>();
  const name = useState<string>("attendance_name", () => "");
  const dob = useState<number | null>("attendance_dob", () => null);
  const gender = useState<string>("attendance_gender", () => "");
  const local_id = useState<string>("attendance_local", () => "");
  const message = useState<string>("attendance_message", () => "");
  const records = useState<any[]>("attendance_records", () => []);
  const gName = useState<string>("attendance_gName", () => "");
  const gContact = useState<string>("attendance_gContact", () => "");
  const selectedRecord = useState<string | undefined>("attendance_selectedRecord", () => undefined);
  const processing = ref<boolean>(false)
  const { isAdminRoute } = useCommon()
  const { showModal } = useCommon()

  const localId = computed(() => useAuth().user.value.local_id)

  const getAttendance = async () => {
    const res = await $fetch('/api/admin/attendance/list', {
      method: 'POST',
      body: {
        local_id: localId.value
      }
    });
    return res;
  };

  const getRecords = async () => {
    let query = client.from("kids").select("*");
    query = query.order("created_at", { ascending: false });
    if (!isAdminRoute.value) { // if not adminRoute, retrieve per the user(teacher)'s local
      query = query.eq("local_id", localId.value);
    }
    const { data, error } = await query;

    if (error) throw error;
    records.value = data;
    return data;
  };

  const addKid = async () => {
    processing.value = true
    try {
      const { success, added_to_session } = await $fetch('/api/admin/kids/create', {
        method: 'POST',
        body: {
          full_name: name.value, 
          dob: dob.value, 
          gender: gender.value,
          local_id: local_id.value || localId.value,
          avatar_url: generateAvatar({ name: name.value, gender: gender.value }),
          guardian_name: gName.value,
          guardian_contact: gContact.value
        }
      });

      if (success) {
        if (added_to_session) {
          message.value = "Kid added and included in the current session";
        } else {
          message.value = "Kid added successfully";
        }
        name.value = "";
        dob.value = null;
        gender.value = "";
        local_id.value = "";
        gName.value = "";
        gContact.value = "";
      } else {
        message.value = "Error adding kid";
      }

      await getRecords();
      showModal(SuccessModal, { message });
    } catch (err: any) {
      message.value = `Error adding kid: ${err?.data?.message || err.message || err}`;
      showModal(SuccessModal, { message });
    } finally {
      processing.value = false;
    }
  };

  const editKid = async (kid_id: string) => {
    if (!kid_id) {
      message.value = "Error: No ID provided for edit";
      return;
    }
    processing.value = true
    try {
      const { error } = await client
        .from("kids")
        .update({
          full_name: name.value,
          dob: dob.value,
          gender: gender.value,
          local_id: local_id.value || localId.value,
          avatar_url: generateAvatar({name: name.value, gender: gender.value}),
          guardian_name: gName.value,
          guardian_contact: gContact.value
        })
        .eq("id", kid_id);

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
      message.value = `Error editing kid: ${err?.message || err}`;
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
    local_id,
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
