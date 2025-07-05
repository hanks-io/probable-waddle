
export default (event: CustomEvent) => {
    return event.detail.value.replace(/[^a-zA-Z0-9\s^]+/g, '');
}

