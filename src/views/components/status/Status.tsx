import React from 'react';
import styled from 'styled-components';
import { FaMagic, FaSmile, FaList, FaRegHandPointUp } from 'react-icons/fa';

import { TreeListType, StatusType } from '@views/interfaces';

type Props = {
    status: StatusType;
    pointer: number;
    current?: TreeListType;
};

export function Status({ status, current, pointer }: Props) {
    return (
        <FooterEl>
            <ContainerDiv className="status-bar">
                <List>
                    <Item>
                        <FaSmile size="12px" style={{ marginRight: '6px' }} />
                        status: {status}
                    </Item>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                    >
                        <Item style={{ flex: 0.4 }}>
                            <FaList
                                size="12px"
                                style={{ marginRight: '6px' }}
                            />
                            {current?.nested?.length || '-'}
                        </Item>
                        <Item>
                            <FaRegHandPointUp
                                size="12px"
                                style={{ marginRight: '6px' }}
                            />{' '}
                            {current?.title}
                        </Item>
                        <Item style={{ width: '200px', flex: 1.2 }}>
                            <FaMagic
                                size="12px"
                                style={{
                                    marginRight: '6px',
                                }}
                            />{' '}
                            {current?.nested?.[pointer]?.title}
                        </Item>
                    </div>
                </List>
            </ContainerDiv>
        </FooterEl>
    );
}

export default Status;

const FooterEl = styled.footer`
    background-color: #007acc;
    padding: 2px;
    color: #fff;
    height: 19px;
    font-size: 12px;
`;

const ContainerDiv = styled.div`
    padding: 1px 8px;
`;

const Item = styled.li`
    flex: 1;
    min-width: 32px;
    align-items: base;
    padding-right: 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`;

const List = styled.ul`
    padding: 0px;
    margin: 0px;
    list-style-type: none;
    display: flex;

    &:first-child {
        flex: 3;
    }
`;
