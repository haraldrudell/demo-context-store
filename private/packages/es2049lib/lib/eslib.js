'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var AWS = _interopDefault(require('aws-sdk'));
var IniParser = _interopDefault(require('@jedmao/ini-parser'));
var fs = _interopDefault(require('fs-extra'));
var os = _interopDefault(require('os'));
var path = _interopDefault(require('path'));

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

/*
args: array of string like ['node', '--version']
regExpValue: RegExp and value pairs like [/IP/g, '1.2.3.4']

return value: array of string: patched command
*/
function patchCommand(args, ...regExpValue) {
  if (!Array.isArray(args)) throw new Error(`patchCommand: args not array`);
  return args.map((arg, index) => {
    const at = typeof arg;
    if (at !== 'string') throw new Error(`patchCommand: args index #${index} not string: ${at} args: ${args.join(' ')}`);
    for (let i = 0; i < regExpValue.length; i += 2) {
      const regExp = regExpValue[i];
      const value = regExpValue[i + 1];
      arg = arg.replace(regExp, value);
    }
    return arg;
  });
}

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

class AwsSdk {

  constructor(o) {
    this._serviceInterfaceObjects = {};

    this.m = String(Object(o).name || 'AwsSdk');
  }

  getService(serviceName) {
    const st = typeof serviceName;
    if (!serviceName || st !== 'string') throw new Error(`${this.m} service not non-empty string: ${st}`);

    // cached service interface objects
    const { _serviceInterfaceObjects: awsServices } = this;
    const awsService = awsServices[serviceName];
    if (awsService) return awsService;

    // instantiate
    const construct = AWS[serviceName];
    if (typeof construct !== 'function') {
      console.error(`Available AWS services: ${this.getServiceList({ string: true })}`);
      throw new Error(`${this.m} service not in aws-sdk: ${serviceName}`);
    }
    // have constructor populate service.config.credentials service.config.region
    process.env.AWS_SDK_LOAD_CONFIG = 1; // use: AWS_PROFILE ~/.aws/config ~/.aws/credentials
    const service = awsServices[serviceName] = new construct(); // service interface object
    if (!service.config.credentials) {
      const p = process.env.AWS_PROFILE;
      const value = p !== undefined ? `'${p}'` : 'undefined';
      throw new Error(`${this.m} credentials missing: set AWS_PROFILE to one of: ${this.getProfilesSync().join(' ')}. AWS_PROFILE was: ${value}`);
    }
    if (!service.config.region) {
      const { profile } = service.config.credentials;
      throw new Error(`${this.m} region not set in ~/.aws/config for profile: '${profile}`);
    }
    return service;
  }

  hasCredentials() {
    return !!AWS.config.credentials;
  }

  getProfilesSync() {
    const { awsCredentialsPath: file } = AwsSdk;
    if (fs.pathExistsSync(file)) return this._parseProfiles(fs.readFileSync(file, 'utf8'));
  }

  async getProfiles() {
    const { awsCredentialsPath: file } = AwsSdk;
    if (await fs.pathExists(file)) return this._parseProfiles((await fs.readFile(file, 'utf8')));
  }

  setRegion({ region, profile, service }) {
    if (region === undefined && profile) {
      const { awsConfigPath: file } = AwsSdk;
      if (fs.pathExistsSync(file)) {
        const data = new IniParser().parse(fs.readFileSync(file, 'utf8'));
        const key = `profile ${profile}`;
        for (let section of data.items) {
          const { name, nodes } = section;
          if (name === key) {
            for (let node of nodes) {
              if (node.key === 'region') {
                region = node.value;
                break;
              }
            }
          }
          if (region) break;
        }
      }
    } else if (typeof region !== 'string') region = String(region);
    if (region !== undefined) {
      if (region === null) region = undefined;
      if (!service) service = AWS;
      //service.config.update({region}) // this fails b/c service CloudFormation domain is undefined
    }
  }

  getServiceList(o) {
    const { string } = o || false;
    let services = [];
    for (let [serviceName, fn] of Object.entries(Object(AWS))) if (typeof fn === 'function') services.push(serviceName);
    services = services.sort();
    return !string ? services : services.join(' ');
  }

  _parseProfiles(text) {
    const profiles = new Set();
    for (let section of new IniParser().parse(text).items) {
      const { name, nodes } = section;
      name && nodes && nodes.length && profiles.add(name);
    }
    return Array.from(profiles).sort();
  }
}
AwsSdk.awsCredentialsPath = path.join(os.homedir(), '.aws', 'credentials');
AwsSdk.awsConfigPath = path.join(os.homedir(), '.aws', 'config');

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
function getNonEmptyString(value, errorFn, defaultValue, undefinedOk) {
  return checkType({ value, errorFn, defaultValue, undefinedOk, type: 'string', m: 'non-empty string' });
}

function getObject(value, errorFn, defaultValue, undefinedOk) {
  return checkType({ value, errorFn, defaultValue, undefinedOk, type: 'object', m: 'object' });
}

function checkType({ value, errorFn, defaultValue, undefinedOk, type, m }) {
  getFunction(errorFn);
  if (value === undefined) value = defaultValue;
  if (!(value === undefined && undefinedOk)) {
    const vt = typeof value;
    if (!value || vt !== type) throw new Error(errorFn(`not ${m}: type: ${vt}`));
  }
  return value;
}

function getFunction(fn, m) {
  const ft = typeof fn;
  if (ft !== 'function') throw new Error(`${m} not function: ${ft}`);
  return ft;
}

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
function throwWithMethod(e, method) {
  console.error(`${method}:`);
  throw Object.assign(e, { method });
}

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

class StackShim extends AwsSdk {
  constructor(o) {
    super(o);

    this.throwE = (e, m) => {
      console.error(`${this.m} ${m}:`);
      throw e;
    };

    !o && (o = false);
    this.m = String(o.name || 'StackShim');
    //this.stackName = getNonEmptyString(o.stackName, m => `${this.m} stackName: ${m}`)
    this.cf = this.getService('CloudFormation');
  }

  async verifyState(state, stack = this.stackName) {
    const newState = await this.getStackStatus(stack);
    if (newState !== state) throw new Error(`Unexpected state for stack ${stack}: ${newState}, expected ${state}. Check CloudFormation Stacks Events on AWS Web site https://console.aws.amazon.com/cloudformation`);
    return newState;
  }

  async createStack(o) {
    const templateFile = getNonEmptyString(o.templateFile, m => `${this.m} templateFile: ${m}`);
    const parameters = getObject(o.parameters, m => `${this.m} parameters: ${m}`, undefined, true);
    const { cf, stackName } = this;
    const response = await cf.createStack({
      StackName: stackName,
      Capabilities: ['CAPABILITY_IAM'],
      TemplateBody: await fs.readFile(templateFile, 'utf8'),
      Parameters: parameters
    }).promise().catch(e => this.throwE(e, 'createStack'));
    const stackId = Object(response).StackId;
    if (!stackId || typeof stackId !== 'string') throw new Error(`${this.m}: bad response from aws createStack`);
    return stackId;
  }

  async waitWhile(whileInState) {
    // 171222 hr: aws-sdk has waitFor but it hangs. This here is similar
    for (;;) {
      const state = await this.getStackStatus();
      if (state !== whileInState) break;
      await new Promise((resolve, reject) => setTimeout(resolve, 5e3));
    }
  }

  async deleteStack(stack) {
    await this.cf.deleteStack({ StackName: this.stackName }).promise();
  }

  async getStacks() {
    return (await this.cf.listStacks().promise().catch(e => throwWithMethod(`${this.m}.getStacks`))).StackSummaries;
  }

  async getStackNames() {
    return (await this.getStacks()).map(summary => summary.StackName);
  }

  async getStackStatus(name = this.stackName) {
    // string or null
    const cf = this.getService('CloudFormation');
    const response = await cf.listStacks().promise();
    const stackSummaries = Object(response).StackSummaries;
    if (!Array.isArray(stackSummaries)) throw new Error(`${this.m}: bad AWS response for listStacks`);
    for (let stack of stackSummaries) {
      const stackName = Object(stack).StackName;
      if (!stackName || typeof stackName !== 'string') throw new Error(`${this.m}: bad AWS StackName`);
      if (stackName === name) {
        const stackStatus = stack.StackStatus;
        if (!stackStatus || typeof stackStatus !== 'string') throw new Error(`${this.m}: bad AWS StackStatus`);
        return stackStatus;
      }
    }
    return null;
  }

  getRegion() {
    return this.cf.config.region;
  }
}

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

class StackCreator extends StackShim {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.typicalCreateSeconds = 40, _temp;
  }

  async create({ templateFile, parameters }) {
    const { stackName: stack } = this;
    console.log(`Checking status of stack: ${stack}`);
    const stackStatus = await this.getStackStatus();
    console.log(`${stack}: ${stackStatus || 'does not exist'}`);
    switch (stackStatus) {
      case 'ROLLBACK_IN_PROGRESS':
        console.log(`waiting for: ${stack} ${new Date().toISOString()}…`);
        await this.waitWhile('ROLLBACK_IN_PROGRESS');
      case 'ROLLBACK_COMPLETE':
        console.log(`Initiating delete of ${stack}…`);
        await this.deleteStack();
      case 'DELETE_IN_PROGRESS':
        console.log(`waiting for: ${stack} ${new Date().toISOString()}…`);
        await this.waitWhile('DELETE_IN_PROGRESS');
      case 'DELETE_COMPLETE':
      case null:
        // the task does not exist at all
        console.log(`Initiating create of ${stack}…`);
        const stackId = await this.createStack({ templateFile, parameters });
        console.log(`stack id: ${stackId}`);
      case 'CREATE_IN_PROGRESS':
        const t0 = Date.now();
        console.log(`waiting for: ${stack} [${this.typicalCreateSeconds} s] ${new Date(t0).toISOString()}`);
        await this.waitWhile('CREATE_IN_PROGRESS');
        const duration = (Date.now() - t0) / 1e3;
        console.log(`Done in ${duration.toFixed(1)} s! verifying…`);
        const newState = await this.verifyState('CREATE_COMPLETE');
        console.log(`${stack}: ${newState}`);
      case 'CREATE_COMPLETE':
        break;
      default:
        throw new Error(`Unknown stack state for ${stack}: ${stackStatus}`);
    }
  }
}

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

class StackManager extends StackCreator {
  constructor(o) {
    super(Object.assign({ name: 'StackManager' }, o));
  }
}

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/

exports.AwsSdk = AwsSdk;
exports.StackManager = StackManager;
exports.Stacks = StackShim;
exports.patchCommand = patchCommand;
exports.getNonEmptyString = getNonEmptyString;
exports.getObject = getObject;
exports.throwWithMethod = throwWithMethod;
