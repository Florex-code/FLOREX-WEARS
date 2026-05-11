import { supabase } from "./supabase";

export async function saveOrder(order) {
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select();

  if (error) {
    console.error("Save order error:", error);
    return null;
  }

  return data;
}

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function updateOrderStatus(id, status) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) console.error(error);
}

export async function deleteOrder(id) {
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) console.error(error);
}