import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      cliente_nome,
      cliente_telefone,
      endereco,
      tipo_entrega,
      forma_pagamento,
      troco_para,
      subtotal,
      taxa_entrega,
      total,
      observacoes,
      itens,
    } = body;

    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .insert({
        origem: "valefood",
        cliente_nome,
        cliente_telefone,
        endereco,
        tipo_entrega,
        forma_pagamento,
        troco_para,
        subtotal,
        taxa_entrega,
        total,
        observacoes,
        status: "novo",
      })
      .select("id")
      .single();

    if (pedidoError) {
      return NextResponse.json(
        { error: pedidoError.message },
        { status: 500, headers: corsHeaders() }
      );
    }

    if (Array.isArray(itens) && itens.length > 0) {
      const itensFormatados = itens.map((item: any) => ({
        pedido_id: pedido.id,
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco,
      }));

      const { error: itensError } = await supabase
        .from("pedido_itens")
        .insert(itensFormatados);

      if (itensError) {
        return NextResponse.json(
          { error: itensError.message },
          { status: 500, headers: corsHeaders() }
        );
      }
    }

    return NextResponse.json(
      { ok: true, pedido_id: pedido.id },
      { headers: corsHeaders() }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500, headers: corsHeaders() }
    );
  }
}