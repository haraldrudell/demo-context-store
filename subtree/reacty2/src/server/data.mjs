/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
export default {
  jobs: [
    { name: 'Name 1', id: 'rJK69pItf', results: { status: 'finished', images: ['/images/strength2.jpg', '/images/strength1.jpg', '/images/data2.jpg', '/images/data3.jpg', '/images/data4.jpg', '/images/data5.jpg']}},
    { name: 'Name 2', id: 'BJxY6cTUKM', results: { status: 'finished', images: ['/images/radio2.jpg', '/images/radio1.jpg', '/images/data2.jpg', '/images/data3.jpg', '/images/data4.jpg', '/images/data5.jpg']}},
    { name: 'Name 3', id: 'H1ZKaqTLFf', results: { status: 'finished', images: ['/images/turbulence2.jpg', '/images/turbulence1.jpg', '/images/data2.jpg', '/images/data3.jpg', '/images/data4.jpg', '/images/data5.jpg']}},
  ],
  software: [
    { label: 'Computational Fluid Dynamics', id: 'cfd', info:'Computational fluid dynamics (CFD) is a branch of fluid mechanics that uses numerical analysis and data structures to solve and analyze problems that involve fluid flows', applications: [{label: 'Aircraft Icing', id: 'icing', image: "path"}, {label: 'Turbomachinery', id: 'turbomachinery', image: 'path'}, {label: 'Turbulence Modeling', id: 'turbulence', image: 'path'} ]},
    { label: 'Structural Analysis', id: 'structural', info:'Structural analysis is the determination of the effects of loads on physical structures and their components. Structures subject to this type of analysis include all that must withstand loads, such as buildings, bridges, vehicles, machinery, furniture, attire, soil strata, prostheses and biological tissue.', applications: [{label: 'Strength Analysis', id: 'strength', image: "path"}, {label: 'Thermal Analysis', id: 'thermal', image: 'path'}, {label: 'Impact', id: 'impact', image: 'path'} ]},
    { label: 'Electromagnetics', id: 'electromagnetics', info:'Electromagnetism is a branch of physics involving the study of the electromagnetic force, a type of physical interaction that occurs between electrically charged particles.', applications: [{label: 'Radio Frequency Interference', id: 'radio', image: "path"}, {label: 'Electronics Cooling', id: 'cooling', image: 'path'} ]},
  ],
  hardware: [
    { label: 'Intel Xeon E4-1676  @ 2.3 GHz', id: 'e4', max: 32 },
    { label: 'Intel Xeon E5-2667 @ 2.7 GHz', id: 'e5', max: 32 },
    { label: 'Intel Xeon Platinum 8168 @ 3.2 GHz', id: 'platinum', max: 64 },
  ],
  results: {
    cfd: {
      icing: {images: ['/images/icing2.jpg', '/images/icing1.jpg', '/images/data2.jpg', '/images/data3.jpg', '/images/data4.jpg', '/images/data5.jpg']},
      turbomachinery: {images: ['/images/turbomachinery2.jpg', '/images/turbomachinery1.jpg', '/images/data2.jpg', '/images/data3.jpg', '/images/data4.jpg', '/images/data5.jpg']},
      turbulence: {images: ['/images/turbulence2.jpg', '/images/turbulence1.jpg', '/images/data2.jpg', '/images/data3.jpg', '/images/data4.jpg', '/images/data5.jpg']}
    },
    structural: {
      strength: {images: ['/images/strength2.jpg', '/images/strength1.jpg', '/images/data2.jpg', '/images/data3.jpg', '/images/data4.jpg', '/images/data5.jpg']},
      thermal: {images: ['/images/thermal2.jpg', '/images/thermal1.jpg', '/images/data2.jpg', '/images/data3.jpg', '/images/data4.jpg', '/images/data5.jpg']},
      impact: {images: ['/images/impact2.jpg', '/images/impact1.jpg', '/images/data2.jpg', '/images/data3.jpg', '/images/data4.jpg', '/images/data5.jpg']},
    },
    electromagnetics: {
      radio: {images: ['/images/radio2.jpg', '/images/radio1.jpg', '/images/data2.jpg', '/images/data3.jpg', '/images/data4.jpg', '/images/data5.jpg']},
      cooling: {images: ['/images/cooling2.jpg', '/images/cooling1.jpg', '/images/data2.jpg', '/images/data3.jpg', '/images/data4.jpg', '/images/data5.jpg']},
    }
  },
}
