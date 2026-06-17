import { NextResponse } from 'next/server';

export class ApiResponse {
  static success(data: unknown, status: number = 200, meta?: unknown) {
    const body: any = { data };
    if (meta) body.meta = meta;
    return NextResponse.json(body, { status });
  }

  static created(data: unknown) {
    return NextResponse.json(data, { status: 201 });
  }

  static noContent() {
    return new NextResponse(null, { status: 204 });
  }
}