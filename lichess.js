
const populatePlayerData = (playerData) =>{
    document.getElementById("playerName").innerHTML = playerData.username;
    document.getElementById("bulletRating").innerHTML = playerData.perfs.bullet.rating;
    document.getElementById("blitzRating").innerHTML = playerData.perfs.blitz.rating;
    document.getElementById("rapidRating").innerHTML = playerData.perfs.rapid.rating;
    document.getElementById("classicalRating").innerHTML = playerData.perfs.classical.rating;
    document.getElementById("ratedGames").innerHTML = playerData.count.rated;
}

const fetchPlayerData = async () =>{
    const playerName = document.getElementById("playerNameInput").value;
    let errorText = document.getElementById("errorTextPlayerNotFound");
    errorText.style.display = "none";
    try {
        const response = await fetch (`https://lichess.org/api/user/${playerName}`)
        const result = await response.json();
        populatePlayerData(result);

    } catch (error) {
      console.log(error);
      errorText.innerHTML = `Player '${playerName}' not found`;
      errorText.style.display = "block";
    }
}

const fetchLeaderboards = async () =>{
    try{
        const response = await fetch ('https://lichess.org/api/player');
        const result = await response.json();
        populateLeaderboards(result);
    } catch {
        console.log(error);
    }
}

const testPlayer1 = async () =>{
    success = true;

    const player1 = document.getElementById("inputPlayer1").value;
    const errorPlayer1 = document.getElementById("errorTextPlayer1NotFound");
    const scoreCard = document.getElementById("player1ScoreCard");

    errorPlayer1.style.display = "none";

    try{
        const response = await fetch (`https://lichess.org/api/user/${player1}`);
        const result = await response.json();
        if(!response.ok)
           throw "error";
    } catch (error) {
        errorPlayer1.innerHTML = `Player '${player1}' not found`
        errorPlayer1.style.display = "block";
        success = false;
    }
    testPlayer2 (player1, success);
}

const testPlayer2 = async (player1, success) =>{

    const player2 = document.getElementById("inputPlayer2").value;
    const errorPlayer2 = document.getElementById("errorTextPlayer2NotFound");


    errorPlayer2.style.display = "none";

    try{
        const response = await fetch (`https://lichess.org/api/user/${player2}`);
        const result = await response.json();
        if(!response.ok)
            throw "error";
    } catch (error) {
        errorPlayer2.innerHTML = `Player '${player2}' not found`
        errorPlayer2.style.display = "block";
        scoreCard.display = "none";
        success = false;
    }
    if (!success)
        return;
    fetchRivals(player1, player2);
}

const fetchRivals = async (player1, player2) =>{


    


    try{ 
        const response = await fetch (`https://lichess.org/api/crosstable/${player1}/${player2}`);
        result = await response.json();
        console.log(result);
        
        player1Score = result.users[player1];
        player2Score = result.users[player2];

        document.getElementById("player1Name").innerHTML = player1;
        document.getElementById("player2Name").innerHTML = player2;

       document.getElementById("player1Score").innerHTML = player1Score;
       document.getElementById("player2Score").innerHTML = player2Score;

    } catch (error) {
        console.log(error);
    }

}

const populateLeaderboards = (leaderboardData) => {
    for (category of ["bullet", "blitz", "rapid", "classical"]){
        const parentElement = document.getElementById(`leaderboard-${category}`);
        for (player of leaderboardData[category]){
            const newElement = document.createElement('li');
            newElement.className = ("list-group-item text-white bg-secondary text-center");
            const playerName = player.username;
            const rating = player.perfs[category].rating;
            newElement.innerHTML = `${playerName}, rating: ${rating}`;
            newElement.addEventListener("click", () => {
                document.getElementById("playerNameInput").value = playerName;
                fetchPlayerData();
                window.location.href = "#sectionPlayerInfo";
            })
            parentElement.appendChild(newElement);
        }
    }
}


document.getElementById("buttonSearchPlayer").addEventListener("click", fetchPlayerData);
document.getElementById("buttonSearchRivals").addEventListener("click", testPlayer1);

const nameInputField = document.getElementById("playerNameInput");
nameInputField.addEventListener("keypress", (event) => {
    if (event.key == "Enter")
        fetchPlayerData();
});
fetchLeaderboards();

