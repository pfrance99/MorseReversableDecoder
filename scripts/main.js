$(document).ready(function() {

  var lineSize;
  var traduction = '';
  var white = 'rgb(255, 255, 255)';
  var black = 'rgb(0, 0, 0)';
  var columnSize = 19;
  var authorized = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  var code = {
    va : ['.', '_'],
    vb : ['_', '.', '.', '.'],
    vc : ['_', '.', '_', '.'],
    vd : ['_', '.', '.'],
    ve : ['.'],
    vf : ['.', '.', '_', '.'],
    vg : ['_', '_', '.'],
    vh : ['.', '.', '.', '.'],
    vi : ['.', '.'],
    vj : ['.', '_', '_', '_'],
    vk : ['_', '.', '_'],
    vl : ['.', '_', '.', '.'],
    vm : ['_', '_'],
    vn : ['_', '.'],
    vo : ['_', '_', '_'],
    vp : ['.', '_', '_', '.'],
    vq : ['_', '_', '.', '_'],
    vr : ['.', '_', '.'],
    vs : ['.', '.', '.'],
    vt : ['_'],
    vu : ['.', '.', '_'],
    vv : ['.', '.', '.', '_'],
    vw : ['.', '_', '_'],
    vx : ['_', '.', '.', '_'],
    vy : ['_', '.', '_', '_'] ,
    vz : ['_', '_', '.', '.'],
    v0 : ['_', '_', '_', '_', '_'],
    v1 : ['.', '_', '_', '_', '_'],
    v2 : ['.', '.', '_', '_', '_'],
    v3 : ['.', '.', '.', '_', '_'],
    v4 : ['.', '.', '.', '.', '_'],
    v5 : ['.', '.', '.', '.', '.'],
    v6 : ['_', '.', '.', '.', '.'],
    v7 : ['_', '_', '.', '.', '.'],
    v8 : ['_', '_', '_', '.', '.'],
    v9 : ['_', '_', '_', '_', '.'],
  };

  $('#start-game').on('click', function () {
    !$('.content').html() ? launchCrypt(): printErrorMessage();
  });

  $('#reset-game').on('click', function () {
    $('.content').empty();
  });

  $('#switch-crypt').on('click', function () {
    $('.content').empty();
    $('#start-game').css('display', 'block');
    $('#decrypt').css('display', 'none');
    $('#reset-game').css('display', 'block');
    $('#crypt-string').prop('disabled', false);
    $('#crypt-label').html('Chaine de caractères à crypter');
    $('#crypt-string').val('');
  });

  $('#switch-decrypt').on('click', function () {
    $('#crypt-string').val('');
    $('.content').empty();
    $('#start-game').css('display', 'none');
    $('#decrypt').css('display', 'block');
    $('#reset-game').css('display', 'none');
    $('#crypt-string').prop('disabled', true);
    $('#crypt-label').html('Chaine de charactères décryptée');
    lineSize =  25;//$('#crypt-string').val().length; @TODO Nombre de lignes en responsive
    var responsiveLine = 100 / lineSize;
    var responsiveColumn = 100 / columnSize;
    $('.content').append(generateGrid(true));
    $('[data-row]').css('height', responsiveLine + '%');
    $('[data-column]').css('width', responsiveColumn + '%');

    $('.column-decrypt').on('click', function (e) {
      var idClicked = e.currentTarget.attributes.id.value;
      var background = $('#' + idClicked).css('background-color'); /* rgb(255, 255, 255) */
      $('#' + idClicked).css('background-color', background === white ? black : white);
    })

  });

  $('#decrypt').on('click', function () {
    $('#crypt-string').val('');
    traduction = '';
    formateToLitteralMorse();
    $('#crypt-string').val(traduction);
  });

  var convertToMorse = function() {
    var decryptString = $('#crypt-string').val().split('');
    for(var i = 0; i < decryptString.length; i++) {
      var formatedChar = decryptString[i].toLowerCase();
      if(authorized.indexOf(formatedChar) !== -1) {
        var morseCode = code['v' + formatedChar];
        var k = 0; // Compteur de colonnes dans la ligne;
        for(var j = 0; j < morseCode.length; j++) {
          if(morseCode[j] === '.') {
            $('#row' + i + 'column' + k).css('background-color', ' black');
            k += 2;
          } else if (morseCode[j] === '_'){
            for(var l = 0; l < 3; l++) {
              $('#row' + i + 'column' + k).css('background-color', ' black');
              k++;
            }
            k++;
          }
        }
      }
    }
  };

  var formateToLitteralMorse = function() {
    for(var i = 0; i < lineSize; i++) {
      var j = 0;
      var morseChars = [];
      while(j < columnSize) {
        var background = $('#row' + i + 'column' + j).css('background-color');
        if(background === white) {
          if($('#row' + i + 'column' + (j + 1)).css('background-color') === white) {
            break;
          } else {
            j += 2;
          }
        } else if (background === black){
          if($('#row' + i + 'column' + (j + 1)).css('background-color') === white) {
            morseChars.push('.');
            j += 2;
          } else if($('#row' + i + 'column' + (j + 2)).css('background-color') === black){
            morseChars.push('_');
            j +=  4;
          }
        }
      }
      convertMorseArrayToString(morseChars);
    }
  };

  /** Converti un array de type (par ex): ['.', '.', '.'] en un charactère associé via le dictonnaire/objet 'code'
   * @param {Array} char charactere morse en tableau
   * @return {String} retourne le caractère associé
   */
  var convertMorseArrayToString = function (morse) {
    if(morse.length === 0) {
      traduction.length !== 0 ? traduction += ' ' : '';
    } else {
      authorized.forEach(function (char) {
        if((morse[0] === code['v' + char][0]) && (morse.length === code['v' + char].length)){
          if (morse.length === 1) {
            traduction += char;
          }
          for (var i = 1; i < morse.length; i++) {
            if (morse[i] !== code['v' + char][i]) {
              break;
            }
            else if (i === morse.length - 1){
              traduction += char;
              return;
            }
          }
        }
      });
    }
  };

  var launchCrypt = function () {
    lineSize = $('#crypt-string').val().length;
    var responsiveLine = 100 / lineSize;
    var responsiveColumn = 100 / columnSize;
    $('.content').append(generateGrid());
    $('[data-row]').css('height', responsiveLine + '%');
    $('[data-column]').css('width', responsiveColumn + '%');
    convertToMorse();
  };

  var printErrorMessage = function () {
    console.log('ERREUR');
  };

  /**
   * Génere le plateau de jeu
   @param {String} decrypt
   @return {String} html correspondant à la grille
   */
  var generateGrid = function (decrypt) {
    var gridHtml = '';
    for(var i = 0; i < lineSize; i++) {
      gridHtml += '<div data-row="' + i + '">';
      for(var j = 0; j < columnSize; j++) {
        gridHtml += decrypt ? '<div class="column-decrypt" data-column="' + j + '" id="row' + i + 'column' + j + '"></div>' : '<div data-column="' + j + '" id="row' + i + 'column' + j + '"></div>';
      }
      gridHtml += '</div>';
    }
    return gridHtml;
  };

});
