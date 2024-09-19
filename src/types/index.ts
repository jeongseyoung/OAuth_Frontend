import { ResponseDto } from "apis/res";

export type ResponseBody<T> = T | ResponseDto | null;
