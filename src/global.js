export const apiRootUrl = "https://afg50o69y8.execute-api.us-east-2.amazonaws.com/Dev/";

function isEmpty(o) {
    return o === null || o === '';
}

export function submitButtonDisabled(isSendingRequest, formValues) {
    return isSendingRequest ||
        !Object.keys(formValues).every(k => !isEmpty(formValues[k]));
}