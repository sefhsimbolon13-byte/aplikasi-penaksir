import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TEMPEL TOKEN YANG KAMU DAPATKAN DARI LOCAL STORAGE DI SINI:
    const tokenRahasia = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcHMuYnVkaWdhZGFpLmNvbS9hcGkvbG9naW4iLCJpYXQiOjE3ODc1NDcwNDAsImV4cCI6MTc4NzYzMzQ0MCwibmJmIjoxNzg3NTQ3MDQwLCJqdGkiOiJ1emQwNE9NaEZYWkFSSFRRIiwic3ViIjozMDgsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.yVgMDJq5xNl1PdCW5CQwHkNMGyCqbC1wpp2S4mVczZ0";

    const res = await fetch('https://apps.budigadai.com/api/hargapasarsementara?per_page=5000', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${tokenRahasia}`, // Kunci rahasia untuk membobol satpam server
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      cache: 'no-store'
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}