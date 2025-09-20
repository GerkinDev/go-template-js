export class TemplatingError extends Error {
    constructor(message) {
        super(message);
        this.name = "TemplatingError";
    }
}
export class InvalidTemplateError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidTemplateError";
    }
}
//# sourceMappingURL=errors.js.map