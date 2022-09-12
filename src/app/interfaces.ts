export interface ACL {
  obj: string;
  act: string;
  eft: "allow" | "deny";
}
