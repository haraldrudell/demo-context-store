import t from 'prop-types'
import React from 'react'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Input from 'components/Form/Input'
import Icon from 'components/Icon'
import Text from 'components/Text'
import styled from 'styled-components'

import debounce from 'lodash/debounce'

const DEBOUNCE_INTERVAL = 250

const ColumnHeader = ({
    accessor,
    Header,
    align = 'left',
    width,
    isFirst,
    isLast,
    onSort,
    onFilter,
    sortKey = false,
    filterKey = false,
    currentKey = '',
}) => {
    let filterField = null

    const caret = !currentKey.match('-') ? 'caretUp' : 'caretDown'

    const sortedIcon =
        sortKey && currentKey.match(sortKey) ? (
            <Icon type={caret} size="xxs" />
        ) : (
            ''
        )
    const toggleKey = key => {
        key = key.replace('-', '')
        const ret =
            !currentKey.match('-') || !currentKey.match(key) ? `-${key}` : key
        return ret
    }
    const onClick = () => {
        if (sortKey) {
            onSort(toggleKey(sortKey))
        }
    }
    const onFilterFieldChange = () => {
        if (onFilter && filterKey) {
            onFilter(filterKey, filterField.input.value)
        }
    }
    return (
        <StyledTh
            sortKey={sortKey}
            filterKey={filterKey}
            key={accessor}
            style={{ textAlign: align, width }}
        >
            <Block
                onClick={onClick}
                mv={2}
                ml={isFirst ? 2 : 1}
                mr={isLast ? 2 : 1}
            >
                <Text el="div" uppercase align={align} size={-1} weight="bold">
                    {Header}{' '}
                    <StyledFlexy display="inline-flex">
                        {sortedIcon}
                    </StyledFlexy>
                </Text>
            </Block>

            {filterKey && (
                <Block mh={isFirst ? 2 : 1} mr={isLast ? 2 : 1}>
                    <Input
                        ref={ref => (filterField = ref)}
                        placeholder="Filter"
                        onChange={debounce(
                            onFilterFieldChange,
                            DEBOUNCE_INTERVAL,
                        )}
                    />
                </Block>
            )}
        </StyledTh>
    )
}

export default ColumnHeader

ColumnHeader.propTypes = {
    accessor: t.oneOfType([t.func, t.string]),
    Header: t.node,
    align: t.oneOf(['left', 'center', 'right']),
    width: t.string,
    isFirst: t.bool,
    isLast: t.bool,
    onFilter: t.func,
    onSort: t.func,
    sortKey: t.string,
    filterKey: t.string,
    currentKey: t.string,
}
const StyledTh = styled.th`
    ${props => (props.sortKey ? 'cursor: pointer;' : '')};
`
const StyledFlexy = styled(Flexy)`
    vertical-align: text-bottom;
`



// WEBPACK FOOTER //
// ./app/components/Table/components/ColumnHeader/index.jsx