const logError = (message) => {
    const error = new Error(message);
    const stack = error.stack.split('\n').slice(0, 3).join('\n');
    console.error(stack);
}

export { logError }