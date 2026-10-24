import { NextResponse } from 'next/server';
import { ApifyClient } from 'apify-client';
import { cookies } from 'next/headers';

export async function GET() {
  const token = process.env.APIFY_TOKEN;
  if (!token) return NextResponse.json({ success: false, error: 'Token missing' }, { status: 500 });
  const client = new ApifyClient({ token });

  try {
    // 1. Traer Actores y Runs
    const actorsResponse = await client.actors().list({ limit: 50 });
    const actors = actorsResponse.items || [];
    const runsResponse = await client.runs().list({ limit: 200, desc: true });
    const allRuns = runsResponse.items || [];

    const getDateString = (dateVal: any) => {
      if (!dateVal) return "";
      const d = new Date(dateVal);
      return isNaN(d.getTime()) ? "" : d.toISOString();
    };

    // 2. Datos Gráficos y Uptime
    const chartDataMap: Record<string, { date: string, Success: number, Failed: number }> = {};
    allRuns.forEach(run => {
      const isoDate = getDateString(run.startedAt);
      if (!isoDate) return;
      const date = new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!chartDataMap[date]) chartDataMap[date] = { date, Success: 0, Failed: 0 };
      if (run.status === 'SUCCEEDED') chartDataMap[date].Success += 1;
      else if (run.status === 'FAILED' || run.status === 'ABORTED') chartDataMap[date].Failed += 1;
    });
    const chartData = Object.values(chartDataMap).reverse();

    const uptimeData = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayRuns = allRuns.filter(r => getDateString(r.startedAt).startsWith(dateStr));
      const hasFailed = dayRuns.some(r => r.status === 'FAILED' || r.status === 'ABORTED');
      if (dayRuns.length === 0) return { status: 'empty' };
      return { status: hasFailed ? 'failed' : 'success' };
    });

    // 3. Estadísticas de Actores (Filtramos el de finanzas para que no salga en la lista)
    const actorsWithStats = actors
      .filter(actor => actor.name !== 'apify-insights-exporter-api') // <-- Filtro para ocultar el actor de finanzas
      .map((actor) => {
        const actorRuns = allRuns.filter(run => run.actId === actor.id);
        const succeeded = actorRuns.filter(run => run.status === 'SUCCEEDED').length;
        const failed = actorRuns.filter(run => run.status === 'FAILED' || run.status === 'ABORTED').length;
        const total = succeeded + failed;
        const qualityScore = total === 0 ? 100 : Math.round((succeeded / total) * 100);
        return { ...actor, stats: { succeeded, failed, totalRuns: actorRuns.length, qualityScore } };
      });

    // 4. Verificar si es Admin
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('isAdmin')?.value === 'true';

    // 5. Devolver datos
    return NextResponse.json({ 
      success: true, 
      actors: actorsWithStats, 
      chartData, 
      uptimeData, 
      isAdmin 
    });

  } catch (error: any) {
    console.error("🔥 ERROR EN APIFY API:", error.message);
    return NextResponse.json({ success: false, actors: [], chartData: [], uptimeData: [], isAdmin: false });
  }
}

// API para correr un Actor en vivo
export async function POST(req: Request) {
  const { actorId } = await req.json();
  const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
  try {
    await client.actor(actorId).start();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}