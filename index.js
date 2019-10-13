
var state;
var selected;
var turn;
var pathHistory=[];

function num2ij(num){
  var j = num%16;
  var i = (num-j)/16;
  return [i,j];
}

$(".board").on("click",function(){
  var [i,j] = num2ij(this.id);
  if(state[i][j]-1 == turn%2) return; //Opponent chess
  else if(state[i][j]-1 == (turn+1)%2){ //Ally chess
    if(selected==-1){
      selected = this.id;
      pathHistory=[this.id];
    }
  }
  else if(state[i][j]==3){ //node on the pathHistory
    while(pathHistory.length>0 && pathHistory[pathHistory.length-1]!=this.id){
      var [i_p,j_p] = num2ij(pathHistory.pop());
      state[i_p][j_p] = 0;
    }
  }
  else if(selected!=-1){ //empty node
    var [i_l,j_l] = num2ij(pathHistory[pathHistory.length-1]);
    if(pathHistory.length==1){
      if(checkDis1(i,j,i_l,j_l)||checkDis2(i,j,i_l,j_l)){
        pathHistory.push(this.id);
        state[i][j]=3;
      }
    }
    else{
      var [i_bl,j_bl] = num2ij(pathHistory[pathHistory.length-2]);
      if(!checkDis1(i_l,j_l,i_bl,j_bl)&&checkDis2(i,j,i_l,j_l)){
        pathHistory.push(this.id);
        state[i][j]=3;
      }
    }
  }
  draw();
})

function checkDis1(i_n,j_n,i_o,j_o){
  if(i_n-i_o>1||i_n-i_o<-1||j_n-j_o>1||j_n-j_o<-1) return false;
  return true;
}

function checkDis2(i_n,j_n,i_o,j_o){
  if(i_n-i_o==-2&&j_n-j_o==-2&&(state[i_o-1][j_o-1]==1||state[i_o-1][j_o-1]==2)) return true;
  if(i_n-i_o==-2&&j_n-j_o==0&&(state[i_o-1][j_o]==1||state[i_o-1][j_o]==2)) return true;
  if(i_n-i_o==-2&&j_n-j_o==2&&(state[i_o-1][j_o+1]==1||state[i_o-1][j_o+1]==2)) return true;
  if(i_n-i_o==0&&j_n-j_o==-2&&(state[i_o][j_o-1]==1||state[i_o][j_o-1]==2)) return true;
  if(i_n-i_o==0&&j_n-j_o==2&&(state[i_o][j_o+1]==1||state[i_o][j_o+1]==2)) return true;
  if(i_n-i_o==2&&j_n-j_o==-2&&(state[i_o+1][j_o-1]==1||state[i_o+1][j_o-1]==2)) return true;
  if(i_n-i_o==2&&j_n-j_o==0&&(state[i_o+1][j_o]==1||state[i_o+1][j_o]==2)) return true;
  if(i_n-i_o==2&&j_n-j_o==2&&(state[i_o+1][j_o+1]==1||state[i_o+1][j_o+1]==2)) return true;
  return false;
}

$("#confirm").on("click",function(){
  if(pathHistory.length>1){
    var [i_l,j_l] = num2ij(pathHistory.pop());
    var [i_f,j_f] = num2ij(pathHistory[0]);
    state[i_l][j_l] = state[i_f][j_f];
    while(pathHistory.length!=0){
      var [i,j] = num2ij(pathHistory.pop());
      state[i][j] = 0;
    }
    selected=-1;
  }
  turn++;
  draw();
})

$("#cancel").on("click",function(){
  while(pathHistory.length>1){
    var [i,j] = num2ij(pathHistory.pop());
    state[i][j] = 0;
  }
  pathHistory.pop()
  selected=-1;
  draw();
})

$("#start").on("click",function(){
  $("#start span").text("Restart");
  turn=0;
  selected = -1;
  state = [[1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2],
          [0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
          [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2],
          [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2]];
  draw();
});

function draw(){
  for(var i=0;i<16;i++){
    for(var j=0;j<16;j++){
      var node = $("#"+(i*16+j))[0];
      if(node.childElementCount!=0){
        node.removeChild(node.lastChild);
      }
      var newDiv = document.createElement("div");
      if(state[i][j]==1){
        if((i*16+j)==selected) newDiv.className = "chess chessBlack chessSelected";
        else newDiv.className = "chess chessBlack";
      }
      if(state[i][j]==2){
        if((i*16+j)==selected) newDiv.className = "chess chessWhite chessSelected";
        else newDiv.className = "chess chessWhite";
      }
      if(state[i][j]==3){
        newDiv.className = "chess chessPath";
      }
      node.appendChild(newDiv);
    }
  }
  $(".turn span").text((turn-turn%2)/2);
  if(turn%2) $(".next span").text("Black");
  else $(".next span").text("White");
  if(pathHistory.length<1){
    $("#confirm").attr("disabled", true);
    $("#cancel").attr("disabled", true);
  }
  else{
    $("#confirm").removeAttr("disabled");
    $("#cancel").removeAttr("disabled");
  }
}
