import { newModelFromString } from "casbin";

const modelDefinition = `
  [request_definition]
  r = sub, obj, act
  [policy_definition]
  p = sub, obj, act, eft
  [policy_effect]
  e = some(where (p.eft == allow)) && !some(where (p.eft == deny))
  [matchers]
  m = (r.obj == p.obj || p.obj == '*') && (r.act == p.act || p.act == '*' || crudMatch(r.act, p.act))
`;

export function getModel() {
  return newModelFromString(modelDefinition);
}
