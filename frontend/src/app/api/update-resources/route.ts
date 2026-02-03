import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_KEY = process.env.API_KEY

export async function POST() {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (API_KEY) headers['X-API-Key'] = API_KEY

    const response = await fetch(`${API_URL}/api/resources/update`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: 'Failed to update resources', detail: error },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      status: 'success',
      message: 'Resources updated successfully',
      counts: result.counts || {}
    });
  } catch (error) {
    console.error('Error in update-resources route:', error);
    return NextResponse.json(
      { error: 'Internal server error', detail: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
