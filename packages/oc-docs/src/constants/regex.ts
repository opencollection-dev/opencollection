export const TEMPLATE_VARIABLE_BODY_PATTERN = '[^}]+';

export const TEMPLATE_VARIABLE_SOURCE_PATTERN = `\\{\\{${TEMPLATE_VARIABLE_BODY_PATTERN}\\}\\}`;

export const VARIABLE_NAME_REGEX = /^[\w-.]*$/;
