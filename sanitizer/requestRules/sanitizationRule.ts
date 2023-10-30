import { Entry } from "../models/harFile";

export interface SanitizationRule{
    getName(): string;
    isApplicable(requestEntry: Entry): boolean;
    sanitize(requestEntry: Entry): void;
}