import FeaturedGame from "./FeaturedGame.tsx";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import moment from 'moment-timezone';
import { GetLogo } from "../data.tsx";
import * as NHLLogos from "./Logos.tsx";


export default function DisplayedGames (displayed_games: Array<Object>) {


  let games_to_display = displayed_games["displayed_games"];
  

  const flatten = (obj, path = '') => {        
    if (!(obj instanceof Object)) return {[path.replace(/\.$/g, '')]:obj};

    return Object.keys(obj).reduce((output, key) => {
        return obj instanceof Array ? 
             {...output, ...flatten(obj[key], path +  '[' + key + '].')}:
             {...output, ...flatten(obj[key], path + key + '.')};
    }, {});
  }

  function getRandomGames (games) {
    let remaining = games.length > 10 ? 10 : games.length
    let random_indices = []
    while (remaining >= 0) {
      let num = getRandomInt(0, games.length)
      if (random_indices.indexOf(num) == -1) {
        random_indices.push(num)
      }
      remaining -= 1;
    }
    let random_games = []
    for (let i = 0; i < random_indices.length; i++) {
      random_games.push(games[random_indices[i]])
    }
    return random_games;
  }

  function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }


  const columns: GridColDef[] = [
    { field: 'localDate', headerName: 'Date', valueGetter: (value, row) => moment.tz(row.scheduled, row["venue.time_zone"]).format('MM/DD/YYYY'), width: 150},
    { field: 'venue.time_zone', headerName: 'Time Zone', width: 150 },
    { field: 'localStartTime', headerName: 'Local Start Time', valueGetter: (value, row) => moment.tz(row.scheduled, row["venue.time_zone"]).format('h:mm A'), width: 150},
    { field: 'venue.name', headerName: 'Venue Name', width: 200 },
    { field: 'venue.city', headerName: 'Venue City', width: 150 },
    { field: 'venue.country', headerName: 'Venue Country', width: 100 },
    { field: 'away_points', headerName: 'Away Score', width: 100, type: "number" },
    { field: 'away.name', headerName: 'Away Team', width: 150 },
    { field: 'home_points', headerName: 'Home Score', width: 100, type: "number" },
    { field: 'home.name', headerName: 'Home Team', width: 150 },
    { field: 'scheduled', headerName: 'Scheduled Time' },
  ];

  return (
      <div className="all_displayed_games">
        Random Games Matching Criteria:
        <div className="featured_games">
          { getRandomGames(games_to_display).map((game, key) => FeaturedGame(game, key)) }
        </div>
        All Games Matching Criteria:
        <DataGrid sx={{ color: "black", backgroundColor: "cornflowerblue"}}
          density="compact" 
          initialState={{
            
            pagination: {paginationModel: { pageSize: 25 }}
          }}
          rows={games_to_display.map((game, key) => flatten(game))} 
          columns={columns} 
          columnVisibilityModel={{scheduled: false}}
          pageSizeOptions={[25, 50, 100]}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'Mui-even' : 'Mui-odd'
          }
      />
      </div>
    )
}