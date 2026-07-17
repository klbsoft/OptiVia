

export default function juan_bush_route():[number,number][]{
return [
     //La Mella
  [18.506512, -69.858294],
  [18.500157, -69.852764],
  [18.492859, -69.850585],
  // curve by san vicente
  [18.490772, -69.850040],
  [18.490060, -69.850126],
  [18.489256, -69.850630],
  [18.486156, -69.852854],
  // elvator under las americas
  [18.483869, -69.854470],
  [18.482523, -69.854963],
  [18.481445, -69.854871],
  
  [18.480931, -69.854761],
  [18.481526, -69.850698],
  [18.481622, -69.848645],
  [18.481590, -69.848163],
  [18.481132, -69.846329],
//18.481547, -69.850642
  // park los 3 ojos intersection 
  [18.481035, -69.844676],
  // start round about los 3 ojos park 
  [18.479760, -69.844640],
  [18.478302, -69.844118],
  [18.478802, -69.843215],
  [18.479398, -69.842391],
  [18.479329, -69.842452],
  [18.480264, -69.841231],
  [18.481212, -69.840529],
  [18.481422, -69.840326],
  // end round about los 3 ojos park 
  [18.481251, -69.839760],
  [18.480365, -69.838459],
  [18.479464, -69.837519],
  [18.472799, -69.832698],
  [18.468120, -69.827801],
  [18.465585, -69.820612],
  [18.464485, -69.810391],
  [18.465273, -69.799652],
  [18.466324, -69.790879],
  [18.465883, -69.781032],
  [18.463560, -69.741736],
  [18.467020, -69.742152],
  [18.471711, -69.742617],
  [18.476290, -69.743098],
  [18.476512, -69.743175],
  [18.480177, -69.743381],
  [18.482984, -69.743545],
  [18.484932, -69.743163],
  [18.484411, -69.753500],
  // possible location 
 

  [18.492384, -69.753636],
  [18.492770, -69.743025],
  [18.496636, -69.743046],
  [18.497321, -69.742956],
  [18.498915, -69.742113],
  [18.502072, -69.740524],
  [18.503108, -69.742936],

  // [18.494422, -69.747005],

  // [18.497660, -69.745212],
  // [18.499668, -69.750616],
  // [18.496233, -69.750609],
  [18.498932, -69.745118],
  [18.498689, -69.745208],
  [18.498404, -69.745273],
  [18.498139, -69.745311],
  [18.498090, -69.745332],
  [18.498002, -69.745432],
  [18.497898, -69.745573],
  [18.498045, -69.745776],
  [18.498351, -69.746399],
  [18.498670, -69.747042],
  [18.498754, -69.747256],
  [18.499877, -69.750799],
  // San Isidro
  [18.495602, -69.750599],
  
];
}








type Coordinate = [number, number];

function interpolate(coord1: Coordinate, coord2: Coordinate, numPoints: number): Coordinate[] {
  const points: Coordinate[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const lat = coord1[0] + (coord2[0] - coord1[0]) * (i / numPoints);
    const lng = coord1[1] + (coord2[1] - coord1[1]) * (i / numPoints);
    points.push([lat, lng]);
  }
  return points;
}

function smoothRoute(route: Coordinate[], pointsBetween: number = 5): Coordinate[] {
  const smoothed: Coordinate[] = [];
  for (let i = 0; i < route.length - 1; i++) {
    const segment = interpolate(route[i], route[i + 1], pointsBetween);
    if (i === 0) {
      smoothed.push(...segment);
    } else {
      smoothed.push(...segment.slice(1));
    }
  }
  return smoothed;
}




function densifyRoute(route: [number, number][],
  pointsPerSegment = 500): [number, number][] {
  if (route.length <= 1) return [...route];

  const result: [number, number][] = [];

  for (let i = 0; i < route.length - 1; i++) {
    const [lat1, lon1] = route[i];
    const [lat2, lon2] = route[i + 1];

    result.push([lat1, lon1]);

    for (let j = 1; j <= pointsPerSegment; j++) {
      const t = j / (pointsPerSegment + 1);

      result.push([
        lat1 + (lat2 - lat1) * t,
        lon1 + (lon2 - lon1) * t,
      ]);
    }
  }

  result.push(route[route.length - 1]);

  return result;
}
 