import { sleep } from "./module2";

export async function module1() {
  await sleep();
  console.log("HELLO, MODULE!");
}
