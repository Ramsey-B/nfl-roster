function NflController() {
    var nflService = new NflService()

    function drawResults(searchPlay) {
        var template = ''
        for (var i = 0; i < searchPlay.length; i++) {
            var player = searchPlay[i]
            template += `
            <div class="col-6">
                        <img src="${player.photo}" alt="">
                        <h3>Name: ${player.fullname}</h3>
                        <h4>Position: ${player.position}</h4>
                        <h4>Team: ${player.pro_team}</h4>
                        <button onclick="app.controller.nflController.addPlayer(${player.id})">Add</button>
                    </div>
            `
        }
        document.getElementById('player-results').innerHTML = template
    }

    function drawTeam(team) {
        var template = ''
        var pos = [team.qb, team.rb1, team.rb2, team.wr1, team.wr2, team.wr3, team.te, team.dst, team.k]
        for (let i = 0; i < pos.length; i++) {
            const player = pos[i];
            template += `
            <div class="col-6">
                        <img src="${player.img}" alt="">
                        <h3>Name: ${player.name}</h3>
                        <h4>Position: ${player.position}</h4>
                        <h4>Team: ${player.team}</h4>
                        <button onclick="app.controller.nflController.removePlayer(${[i]})">Remove</button>
                    </div>
            `
        }
        document.getElementById('user-team').innerHTML = template
    }

    this.search = function search(e) {
        e.preventDefault();
        var searchTerm = e.target.player.value.toUpperCase()
        var teamSearch = nflService.getPlayersByTeam(searchTerm)
        var posSearch = nflService.getPlayersByPosition(searchTerm)
        var nameSearch = nflService.getPlayersByName(searchTerm)
        var teamAndPos = teamSearch.concat(posSearch)
        var resultArr = teamAndPos.concat(nameSearch)
        drawResults(resultArr)
    }

    this.addPlayer = function addPlayer(id) {
        nflService.addPlayer(id, drawTeam)
    }
    this.removePlayer = function removePlayer(num) {
        debugger
        nflService.removePlayer(num, drawTeam)
    }
}


