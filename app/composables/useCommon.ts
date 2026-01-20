export const useCommon = () => {
    const isVisible = useState<boolean>('isVisible', () => false);
    const content = useState<Component | null>('content', () => null);
    const props = useState<Record<string, any>>('props', () => ({}));

    function showModal(component: Component, componentProps = {}) {
        content.value = markRaw(component);
        props.value = componentProps;
        isVisible.value = true;
    }
    function hideModal() {
        isVisible.value = false;
        content.value = null;
        props.value = {};
    }

    const isAdminRoute = computed(() => {
        const route = useRoute()
        const { user } = useAuth()
        return route.path.includes('admin') && user.value?.role === USER_ROLES.admin
    })

    return {
        isVisible,
        content,
        props,
        showModal,
        hideModal,
        isAdminRoute,
    }
}