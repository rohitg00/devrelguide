import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('Starting resource update...');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resources/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${process.env.API_USERNAME}:${process.env.API_PASSWORD}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error updating resources:', error);
      return NextResponse.json(
        { error: 'Failed to update resources', detail: error },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('Update successful:', result);

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
