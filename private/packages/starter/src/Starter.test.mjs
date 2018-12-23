/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Starter from './Starter'

it('Can instantiate Starter', () => {
  const s = new Starter({start: []})
})

it('Starter can process service tree', async () => {
  const o = {
    start: ['postfix'],
    services: {
      mysql: {deps: [
        {mounts: '/mnt/rwstore'},
      ]},
      dovecot: {deps: [
        {services: 'mysql'},
      ]},
      postfix: {deps: [
        {services: 'dovecot'},
      ]},
    },
    mounts: {
      '/mnt/rwstore': {deps: [
        {vgs: '/dev/x'},
      ]},
    },
    vgs: {
      '/dev/x': {
        luksName: 'xpc21_crypt',
        deps: [
          {raids: 'c505'},
      ]},
    },
    raids: {
      'c505': {
        uuid: '6fe99bfc-2d1a-190a-3027-469af4ec5092',
      },
    },
  }

  new Starter({debug: true, ...o})
  //console.log('STARTER', )
})
