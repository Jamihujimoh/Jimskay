import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OverviewCard } from '@/components/dashboard/overview-card';
import { GenAIPanel } from '@/components/dashboard/gen-ai-panel';
import { FileText, Signal, Users, BrainCircuit } from 'lucide-react';
import { PLAYERS } from '@/lib/data';
import { RecentMatches } from '@/components/dashboard/recent-matches';
import { ClubStatsTable } from '@/components/dashboard/club-stats-table';
import { getFixtures, getStandings, getTeams } from '@/lib/api';
import type { Team } from '@/types';

// Define types for fixtures and matches
interface FixtureStatus {
  short: string;
  long?: string;
}

interface Fixture {
  id: number;
  status: FixtureStatus;
  date: string;
  venue?: string;
  // add more properties if needed
}

interface Match {
  fixture: Fixture;
  homeTeam: {
    id: number;
    name: string;
    logo?: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo?: string;
  };
  score?: {
    fullTime?: {
      home: number;
      away: number;
    };
  };
  // add more properties if needed
}

export default async function DashboardPage() {
  const today = new Date().toISOString().split('T')[0];

  // Fetch data
  const liveFixtures: Match[] = await getFixtures({ live: 'all' });
  const allFixtures: Match[] = await getFixtures({ date: today });
  const standings = await getStandings({ league: '39', season: '2024' });
  const teamsData = await getTeams({ league: '39', season: '2024' });
  const teams: Team[] = teamsData.map((t: any) => t.team);

  // Filter matches
  const upcomingMatches = allFixtures.filter(
    (m: Match) => m.fixture.status.short === 'NS'
  );
  const completedMatches = allFixtures
    .filter((m) => m.fixture.status.short === 'FT')
    .slice(0, 10); // Last 10 completed matches

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Overview Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Live Matches"
          value={liveFixtures.length.toString()}
          icon={<Signal className="h-4 w-4 text-muted-foreground" />}
          description="Matches currently in progress"
        />
        <OverviewCard
          title="Total Players"
          value={PLAYERS.length.toString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Tracked players across all teams"
        />
        <OverviewCard
          title="Reports Generated"
          value="142"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          description="AI-powered reports generated this month"
        />
        <OverviewCard
          title="Predictions Made"
          value="78"
          icon={<BrainCircuit className="h-4 w-4 text-muted-foreground" />}
          description="Match outcome predictions this week"
        />
      </div>

      {/* Standings and AI Panel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {/* Premier League Standings */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Premier League Standings</CardTitle>
            <CardDescription>
              Current club standings for the 2023 season.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClubStatsTable standings={standings} />
          </CardContent>
        </Card>

        {/* AI Analysis Panel */}
        <div className="lg:col-span-3">
          <GenAIPanel teams={teams} completedMatches={completedMatches} />
        </div>
      </div>

      {/* Recent Matches Section */}
      <div className="grid grid-cols-1 gap-4">
        <RecentMatches
          liveMatches={liveFixtures}
          upcomingMatches={upcomingMatches}
          completedMatches={completedMatches}
        />
      </div>
    </div>
  );
}
