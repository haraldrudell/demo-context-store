/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import macOSFindNode from './macOSFindNode'

import {spawnCapture} from 'allspawn'

export default class MacOS extends macOSFindNode {
  static netstat = ['netstat', '-nrfinet']
  static ipv4Section = 'Internet' // netstat ipv4 section
  static netstatSectionHeaderLines = 2
  static routeRegexp = /([^ ]+) +([^ ]+) +([^ ]+) +([^ ]+) +([^ ]+) +([^ ]+).*/
  static defaultLine = 'default' // how netstat shows route 0/0
  static defaultRouteBase = {dest: '0.0.0.0', mask: '0.0.0.0', suffix: 0}
  static vpnOverrideLine = '128.0/1'
  static vpnRouteBase = {dest: '128.0.0.0', mask: '128.0.0.0', suffix: 1}

  async getDefaultRoute() { // {dest, gw, iface, mask, suffix} or undefined
    const {defaultLine: destination, defaultRouteBase: routeBase} = MacOS
    return this._getRoute({destination, routeBase})
  }

  async getVpnOverride() {
    const {vpnOverrideLine: destination, vpnRouteBase: routeBase} = MacOS
    return this._getRoute({destination, routeBase})
  }

  async _getRoute({destination, routeBase}) {
    const {routeRegexp, ipv4Section} = MacOS
    const lines = this._getSection(await this._doNetstat(), ipv4Section)
    destination += '\x20'
    for (let line of lines) if (line.startsWith(destination)) {
      const match = line.match(routeRegexp)
      if (!match) throw new Error(`${this.m}.getRoute: parse failed: '${line}'`)
      const [, /*dest*/, gw, /*flags*/, /*refs*/, /*use*/, iface] = match
      return {gw, iface, ...routeBase}
    }
  }

  async _doNetstat() { // array of string
    const {debug} = this
    const {netstat: args} = MacOS
    /* netstat -nrfinet
    Routing tables

    Internet:
    Destination        Gateway            Flags        Refs      Use   Netif Expire
    default            192.168.1.12       UGSc           73        0     en9
    */
   const {stdout} = await spawnCapture({args, echo: debug})
   return stdout.split('\n')
  }

  _getSection(lines, section) { // array of section lines or empty array if not found
    const {netstatSectionHeaderLines} = MacOS
    let index0 = lines.indexOf(`${section}:`)
    if (index0 === -1) return [] // section not found
    let index1 = (index0 += netstatSectionHeaderLines)
    while (lines[index1]) index1++
    return lines.slice(index0, index1)
  }

  /*
  obsolete() {
    "use strict";

    var os    = require('os'),
        exec  = require('child_process').exec,
        async = require('async');

    //////////////////////////////////////////
    // helpers

    function trim_exec(cmd, cb) {
      exec(cmd, function(err, out) {
        if (out && out.toString() != '')
          cb(null, out.toString().trim())
        else
          cb(err)
      })
    }

    function determine_nic_type(str) {
      return str.match(/Ethernet/)
            ? 'Wired'
            : str.match(/Wi-?Fi|AirPort/i)
              ? 'Wireless'
              : str.match(/FireWire/)
                ? 'FireWire'
                : str.match(/Thunderbolt/)
                  ? 'Thunderbolt'
                  : 'Other';
    }

    // exports

    exports.get_active_network_interface_name = function(cb) {
      var cmd = "netstat -rn | grep UG | awk '{print $6}'";
      exec(cmd, function(err, stdout) {
        if (err) return cb(err);

        var raw = stdout.toString().trim().split('\n');
        if (raw.length === 0 || raw === [''])
          return cb(new Error('No active network interface found.'));

        cb(null, raw[0]);
      });
    };

    /* unused

    exports.interface_type_for = function(nic_name, cb) {
      exec('networksetup -listnetworkserviceorder | grep ' + nic_name, function(err, out) {
        if (err) return cb(err);

        var type = out.toString().match(/ethernet|lan/i) ? 'Wired' : 'Wireless';
        cb(null, type);
      })
    };

    exports.mac_address_for = function(nic_name, cb) {
      var cmd = "networksetup -getmacaddress " + nic_name + " | awk '{print $3}'";
      trim_exec(cmd, cb);
    };

    exports.gateway_ip_for = function(nic_name, cb) {
      var cmd = "ipconfig getoption " + nic_name + " router";
      trim_exec(cmd, cb);
    };

    exports.netmask_for = function(nic_name, cb) {
      var cmd = "ipconfig getoption " + nic_name + " subnet_mask";
      trim_exec(cmd, cb);
    };

    exports.get_network_interfaces_list = function(cb) {

      var count = 0,
          list  = [],
          nics  = os.networkInterfaces();

      function append_data(obj) {
        async.parallel([
          function(cb) {
            exports.gateway_ip_for(obj.name, cb)
          },
          function(cb) {
            exports.netmask_for(obj.name, cb)
          }
        ], function(err, results) {
          if (results[0]) obj.gateway_ip = results[0];
          if (results[1]) obj.netmask    = results[1];

          list.push(obj);
          --count || cb(null, list);
        })
      }

      exec('networksetup -listallhardwareports', function(err, out) {
        if (err) return cb(err);

        var blocks = out.toString().split(/Hardware/).slice(1);
        count = blocks.length;

        blocks.forEach(function(block) {
          var parts = block.match(/Port: (.+)/),
              mac   = block.match(/Address: ([A-Fa-f0-9:-]+)/),
              name  = block.match(/Device: (\w+)/);

          if (!parts || !mac || !name)
            return --count;

          var obj   = {},
              port  = parts[1];

          obj.name  = name[1];
          // obj.desc  = port;
          obj.type  = determine_nic_type(port);
          obj.ip_address  = null;
          obj.mac_address = mac[1];

          (nics[obj.name] || []).forEach(function(type) {
            if (type.family == 'IPv4') {
              obj.ip_address = type.address;
            }
          });

          append_data(obj);
        })

        if (count == 0)
          cb(new Error('No interfaces found.'))
      })

    }
  }
  */
}
