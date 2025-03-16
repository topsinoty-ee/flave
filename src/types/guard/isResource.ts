import { Resource } from "../resource";

export function isResource(resource: unknown): resource is Resource {
  return (
    typeof resource === "object" &&
    resource !== null &&
    "user" in resource &&
    typeof (resource as { user: unknown }).user === "object" &&
    (resource as { user: object }).user !== null &&
    "_id" in (resource as { user: object }).user
  );
}
