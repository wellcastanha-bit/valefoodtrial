import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada");
}

if (!serviceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonWithCors(body: any, init?: { status?: number }) {
  return NextResponse.json(body, {
    status: init?.status,
    headers: corsHeaders(),
  });
}

function num(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
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
    } = body ?? {};

    const payloadPedido = {
      origem: "valefood",
      cliente_nome: String(cliente_nome ?? "").trim() || null,
      cliente_telefone: String(cliente_telefone ?? "").trim() || null,
      endereco: String(endereco ?? "").trim() || null,
      tipo_entrega: String(tipo_entrega ?? "").trim() || null,
      forma_pagamento: String(forma_pagamento ?? "").trim() || null,
      troco_para: troco_para == null || troco_para === "" ? null : num(troco_para),
      subtotal: num(subtotal),
      taxa_entrega: num(taxa_entrega),
      total: num(total),
      observacoes: String(observacoes ?? "").trim() || null,
      status: "novo",
    };

    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .insert(payloadPedido)
      .select("id")
      .single();

    if (pedidoError) {
      return jsonWithCors(
        {
          ok: false,
          error: pedidoError.message,
          where: "pedidos.insert",
          payload: payloadPedido,
        },
        { status: 500 }
      );
    }

    if (Array.isArray(itens) && itens.length > 0) {
      const itensFormatados = itens.map((item: any) => ({
        pedido_id: pedido.id,
        nome: String(item?.nome ?? "Item").trim(),
        quantidade: num(item?.quantidade, 1),
        preco: num(item?.preco, 0),
      }));

      const { error: itensError } = await supabase
        .from("pedido_itens")
        .insert(itensFormatados);

      if (itensError) {
        return jsonWithCors(
          {
            ok: false,
            error: itensError.message,
            where: "pedido_itens.insert",
            pedido_id: pedido.id,
            itens: itensFormatados,
          },
          { status: 500 }
        );
      }
    }

    return jsonWithCors({
      ok: true,
      pedido_id: pedido.id,
    });
  } catch (error: any) {
    return jsonWithCors(
      {
        ok: false,
        error: error?.message || "Erro ao criar pedido",
      },
      { status: 500 }
    );
  }
}