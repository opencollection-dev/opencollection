export const TEMPLATE_VARIABLE_BODY_PATTERN = '[^}]+';

export const TEMPLATE_VARIABLE_SOURCE_PATTERN = `\\{\\{${TEMPLATE_VARIABLE_BODY_PATTERN}\\}\\}`;

export const VARIABLE_NAME_REGEX = /^[\w-.]*$/;

/** A valid HTTP header name — no whitespace or line breaks. */
export const HEADER_NAME_REGEX = /^[^\s\r\n]*$/;

/** A valid HTTP header value — no line breaks. */
export const HEADER_VALUE_REGEX = /^[^\r\n]*$/;
