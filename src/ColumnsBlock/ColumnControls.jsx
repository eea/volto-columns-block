import React from 'react';
export default (props) => {
  // selector for column sizes
  return <div>25 33 50 66 75</div>;

  // 25% 25% 50% 75%-> grid de 4 coloane
  // 33% 66% -> grid de 3 coloane
  //
  //
  // 4 coloane:
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
  //  100% ---> pt mobile
};
