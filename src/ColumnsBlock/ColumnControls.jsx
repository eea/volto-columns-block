import React from 'react';

export default (props) => {
  // selector for column sizes
  return (
    <div>
      <div>25 33 50 66 75</div>
    </div>
  );


  // 25% 25% 50% 75%-> grid de 4 coloane
  // 33% 66% -> grid de 3 coloane

  //  Pentru desktop:
  //  4 coloane:
  //  25 25 25 25
  //
  //  3 coloane
  //  25 50 25
  //  50 25 25
  //  25 25 50
  //  33 33 33
  //
  //  2 coloane
  //  25 75
  //  50 50
  //  75 25
  //  33 66
  //  66 33
  //
  // Pentru tableta:
  // 2 coloane si 100%
  //
  // Pentru mobile:
  // 100%
};
