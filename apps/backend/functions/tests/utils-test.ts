import { assertEquals } from "@std/assert";
import { notEmptyOrNull } from "../_shared/utils.ts";

Deno.test(function addTest() {
  assertEquals(notEmptyOrNull(undefined), null);
  assertEquals(notEmptyOrNull("undefined"), null);
  assertEquals(notEmptyOrNull(null), null);
  assertEquals(notEmptyOrNull("null"), null);
  assertEquals(notEmptyOrNull(""), null);
  assertEquals(notEmptyOrNull(" "), null);
});
