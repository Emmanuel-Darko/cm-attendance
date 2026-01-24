import SuccessModal from "~/components/modals/SuccessModal.vue";

export const useAttendance = async () => {
  const name = useState<string>("attendance_name", () => "");
  const dob = useState<number | null>("attendance_dob", () => null);
  const gender = useState<string>("attendance_gender", () => "");
  const local_id = useState<string>("attendance_local", () => "");
  const message = useState<string>("attendance_message", () => "");
  const localKids = useState<any[]>("localKids", () => []);
  const adminKids = useState<any[]>("localKids", () => []);
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

  const getLocalKids = async ({ allHistorical = false }: { allHistorical?: boolean } = {}) => {
    const body: any = {}
    if (!isAdminRoute.value) {
      body.local_id = localId.value
      body.allHistorical = allHistorical
    }
    const data = await $fetch('/api/admin/kids/list', {
      method: 'POST',
      body,
    })
    localKids.value = data
    return data
  }

  const getAdminKids = async () => {
    const data = await $fetch('/api/admin/kids/adminList')
    localKids.value = data
    return data
  }

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

      await getLocalKids();
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
    processing.value = true;
    try {
      const res = await $fetch('/api/admin/kids/edit', {
        method: 'POST',
        body: {
          id: kid_id,
          full_name: name.value,
          dob: dob.value,
          gender: gender.value,
          local_id: local_id.value || localId.value,
          avatar_url: generateAvatar({ name: name.value, gender: gender.value }),
          guardian_name: gName.value,
          guardian_contact: gContact.value,
        }
      });

      if (res?.success) {
        message.value = "Kid updated successfully";
        name.value = "";
        dob.value = null;
        gender.value = "";
        gName.value = "";
        gContact.value = "";
      } else {
        message.value = (res && 'error' in res && res.error) ? res.error : "Error editing kid";
      }
      await getLocalKids();
      showModal(SuccessModal, { message });
    } catch (err: any) {
      message.value = `Error editing kid: ${err?.data?.message || err?.message || err}`;
      showModal(SuccessModal, { message });
    } finally {
      processing.value = false;
    }
  };

  const deleteKid = async (kid_id: string) => {
    if (!kid_id) {
      message.value = "Error: No ID provided for delete";
      return;
    }
    processing.value = true;
    try {
      const res = await $fetch('/api/admin/kids/delete', {
        method: 'POST',
        body: { id: kid_id }
      });
      if (res?.success) {
        message.value = "Successfully deleted kid!";
      } else {
        message.value = (res && 'error' in res && res.error) ? res.error : "Error deleting kid";
      }
      await getLocalKids();
      showModal(SuccessModal, { message });
    } catch (err: any) {
      message.value = `Error deleting kid: ${err?.data?.message || err?.message || err}`;
      showModal(SuccessModal, { message });
    } finally {
      processing.value = false;
    }
  };

  return {
    name,
    dob,
    gender,
    message,
    local_id,
    localKids,
    adminKids,
    gName,
    gContact,
    selectedRecord,
    processing,
    getAttendance,
    getLocalKids,
    getAdminKids,
    addKid,
    editKid,
    deleteKid
  };
};
