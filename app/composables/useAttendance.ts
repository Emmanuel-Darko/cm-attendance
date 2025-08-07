import type { Database } from "~/types/database";

export const useAttendance = async () => {
  const client = useSupabaseClient<Database>();
  const name = ref("");
  const age = ref("");
  const gender = ref("");
  const message = ref("");
  const records = ref<Database[]|any[]>([]);
  const gName = ref("");
  const gContact = ref("");

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
    alert(name.value)
    const { error } = await client
      .from("kids")
      .insert([
        { 
          full_name: name.value, 
          age: Number(age.value), 
          gender: gender.value,
          guardian_name: gName.value,
          guardian_contact: gContact.value
         },
      ]);

    message.value = error ? "Error adding kid" : "Kid added!";
    if (!error) {
      name.value = "";
      age.value = "";
      gender.value = "";
      gName.value = "";
      gContact.value = ""
    }
    await getRecords()
  };

  const editKid = async (kid_id: string) => {
    if (!kid_id) {
      message.value = "Error: No ID provided for edit";
      return;
    }

    const { error } = await client
      .from("kids")
      .update({
        full_name: name.value,
        age: Number(age.value),
        gender: gender.value,
        guardian_name: gName.value,
        guardian_contact: gContact.value
      })
      .eq("id", kid_id);

    message.value = error ? "Error editing kid" : "Kid updated!";
    if (!error) {
      name.value = "";
      age.value = "";
      gender.value = "";
      gName.value = "";
      gContact.value = "";
    }
    await getRecords();
  };

  const deleteKid = (kid_id: string) => {
    if (!kid_id) {
      message.value = "Error: No ID provided for delete";
      return;
    }

    client
      .from("kids")
      .delete()
      .eq("id", kid_id)
      .then(({ error }) => {
        message.value = error ? "Error deleting kid" : "Kid deleted!";
        getRecords();
      });
  }

  return {
    name,
    age,
    gender,
    message,
    records,
    gName,
    gContact,
    getAttendance,
    getRecords,
    addKid,
    editKid,
    deleteKid
  };
};
