// @flow

import React, { PureComponent } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import invariant from 'invariant';

import { renameOrg } from 'api/organization';
import { OrgMemberFragment, mapMemberToUser } from 'api/user';
import RenameModal from 'components/RenameModal';
import { Box, Button, Flex, Text } from 'widgets';
import Loading from 'components/widgets/Loading';
import UserIcon from 'icons/user.png';

type Props = {
  data: {
    loading: boolean,
    organization: ?{
      name: string,
      me: {
        member: Object
      },
      members: Array<Object>
    }
  }
};

class OrgSettings extends PureComponent<Props, {| showRenameModal: boolean |}> {
  state = {
    showRenameModal: false
  };

  toggleRenameModal = () => {
    this.setState({ showRenameModal: !this.state.showRenameModal });
  };

  renameOrg = (orgName: string) => {
    const { organization } = this.props.data;
    invariant(organization != null, 'Missing data');
    if (organization.name !== orgName) renameOrg(orgName);

    this.toggleRenameModal();
  };

  render() {
    const { loading, organization } = this.props.data;
    if (loading) {
      return <Loading text="Loading..." />;
    }

    invariant(organization != null, 'Missing data');
    const users = organization.members.map(mapMemberToUser);
    const me = mapMemberToUser(organization.me.member);

    const { showRenameModal } = this.state;

    return (
      <div>
        <Flex align="center" justify="space-between" mb={3}>
          <Text font="header3">{organization.name}</Text>
          <Button
            disabled={me.role !== 'owner'}
            onClick={this.toggleRenameModal}
          >
            Rename Organization
          </Button>
        </Flex>

        {users.map(user => (
          <Flex
            key={user.email}
            align="center"
            bb={1}
            borderColor="darkBlue4"
            py={3}
          >
            <img
              css={`
                height: 32px;
                width: 32px;
              `}
              alt="Profile"
              src={UserIcon}
            />
            <Box flexGrow ml={3}>
              <Text className="flex-item" font="header5">
                {user.email} ({user.displayName})
              </Text>
            </Box>
            <Text font="bodyMedium">{user.role}</Text>
          </Flex>
        ))}

        {showRenameModal && (
          <RenameModal
            description="Rename Organization"
            initialName={organization.name}
            onClose={this.toggleRenameModal}
            onRename={this.renameOrg}
          />
        )}
      </div>
    );
  }
}

const OrgSettingsQuery = gql`
  query GetOrgSettings {
    organization {
      name
      me {
        member {
          ...OrgMemberFragment
        }
      }
      members {
        ...OrgMemberFragment
      }
    }
  }
  ${OrgMemberFragment}
`;

export default graphql(OrgSettingsQuery)(OrgSettings);



// WEBPACK FOOTER //
// ./src/containers/Settings/Organizations/index.js