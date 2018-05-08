function NflController() {
    var nflService = new NflService()
    //dynamically draws search results
    function drawResults(searchPlay) {
        var template = ''
        for (var i = 0; i < searchPlay.length; i++) {
            var player = searchPlay[i]
            if (player.id) {
                template += `
                    <div class="col-md-5 col-sm-12 card mt-3 mr-3 search-card">
                        <img class='player-img' src="${player.img}">
                        <h3>Name: ${player.name}</h3>
                        <h4>Position: ${player.position}</h4>
                        <h4>Team: ${player.team}</h4>
                        <button class="btn btn-outline-primary mb-2" onclick="app.controller.nflController.addPlayer(${player.id})">Add</button>
                    </div>
            `
            }
        }
        document.getElementById('player-results').innerHTML = template
    }
    //dynamically draws users team
    function drawTeam(team) {
        var template = ''
        var headTemplate
        var pos = [team.qb, team.rb1, team.rb2, team.wr1, team.wr2, team.wr3, team.te, team.dst, team.k]
        for (let i = 0; i < pos.length; i++) {
            const player = pos[i];
            if (player.id) {
                template += `
                    <div class="col-10 offset-2 card mt-3 d-flex flex-column team-card">
                        <img class='player-img' src="${player.img}">
                        <h3>Name: ${player.name}</h3>
                        <h4>Position: ${player.position}</h4>
                        <h4>Team: ${player.team}</h4>
                        <button class="btn btn-outline-danger mb-2" onclick="app.controller.nflController.removePlayer(${player.id})">Remove</button>
                    </div>
            `
            }
        }
        document.getElementById('user-team').innerHTML = template
        //this makes the header team name thing to the right of the search bar
        document.getElementById('team-display').innerHTML = `
        <p>QB: ${team.qb.name ? team.qb.name : 'empty'}<br>
            RB: ${team.rb1.name  ? team.rb1.name : 'empty'}<br>
            RB: ${team.rb2.name ? team.rb2.name : 'empty'}
        </p>
        <p>WR: ${team.wr1.name  ? team.wr1.name : 'empty'}<br>
            WR: ${team.wr2.name  ? team.wr2.name : 'empty'}<br>
            WR: ${team.wr3.name  ? team.wr3.name : 'empty'}
        </p>
        <p>TE: ${team.te.name ? team.te.name : 'empty'}<br>
            DST: ${team.dst.name  ? team.dst.name : 'empty'}<br>
            K: ${team.k.name  ? team.k.name : 'empty'}
        </p>
        `
    }
    //this finds players on search submit
    this.search = function search(e) {
        e.preventDefault();
        //makes search term uppercase so user casing doesnt matter
        var searchTerm = e.target.player.value.toUpperCase()
        //finds players that match search
        var teamSearch = nflService.getPlayersByTeam(searchTerm)
        var posSearch = nflService.getPlayersByPosition(searchTerm)
        var nameSearch = nflService.getPlayersByName(searchTerm)
        //combines arrays returned by all 3 searchs
        var teamAndPos = teamSearch.concat(posSearch)
        var resultArr = teamAndPos.concat(nameSearch)
        //creates search record array in service
        var filteredSearch = nflService.searchRecord(resultArr)
        //clears the seach bar
        document.getElementById("searchForm").reset();
        //draws search results
        drawResults(filteredSearch)
    }

    this.addPlayer = function addPlayer(id) {
        //sends added players id, drawTeam function to services addPlayer function    
        nflService.addPlayer(id, drawTeam, this.removePlayer)
        //removes player from search results and data
        nflService.removeSearch(drawResults)
    }
    this.removePlayer = function removePlayer(id) {
        if (id != undefined) {
            //tells service to removePlayer from userTeam that has that id
            nflService.removePlayer(id, drawTeam)
            //adds removed player back into search results
            nflService.addSearch(id, drawResults)
        }
    }
}
