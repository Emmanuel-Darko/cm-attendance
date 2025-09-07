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
    const generateAvatar = ({name, gender} : {name: string, gender: string}) => {
        if(gender == GENDER.male)
            return `https://avatar.iran.liara.run/public/boy?username=${name.replace(/\s+/g, '')}`
        if(gender == GENDER.female)
            return `https://avatar.iran.liara.run/public/girl?username=${name.replace(/\s+/g, '')}`
    }

    return {
        isVisible,
        content,
        props,
        showModal,
        hideModal,
        generateAvatar
    }
}