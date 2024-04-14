import WatchlistPage from "@/_components/watchlist/watchlist_page";
import { externalGetUserData } from "../_components/settings/userDataActions";
import { getReports } from "@/_components/dashboard/range_graph";
import { getUserId } from "@/_lib/actions";

export default async function Watchlist() {
  const userData = await externalGetUserData();
  const userWatchlist = userData.watchlist ?? [];

  const reports = await getReports(await getUserId());

  return (
    <main>
      {userData && reports && (
        <WatchlistPage userWatchlist={userWatchlist} reports={reports} />
      )}
    </main>
  );
}
