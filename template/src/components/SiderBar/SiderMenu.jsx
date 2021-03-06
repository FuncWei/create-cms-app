import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import styles from './index.less';
import { getCurrentMenu, getPathArray } from 'utils';

const { Sider } = Layout;
const { SubMenu } = Menu;

class Sidebar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            openKeys: this.getDefaultOpenKeys(props),
        };
    }

    getDefaultOpenKeys = (props) => {
        const { location: { pathname } } = props || this.props;
        const openkeys = [];
        let pathArray = [];
        let current = getCurrentMenu(pathname);
        if (current) {
            pathArray = getPathArray(current);
        }
        pathArray.forEach((item) => {
            if (item.child && item.child.length > 0) {
                openkeys.push(`sub${item.id}`);
            }
        });
        return openkeys;
    }

    onOpenChange = (nextOpenKeys) => {
        const { openKeys } = this.state;
        const latestOpenKey = nextOpenKeys.find(key => !(openKeys.indexOf(key) > -1));
        let newOpenKeys = [];
        if (latestOpenKey) {
            newOpenKeys = [].concat(latestOpenKey);
        }
        this.setState({
            openKeys: newOpenKeys,
        });
    };

    menuClickHandle = () => {
        const { isMobile, onCollapse } = this.props;
        isMobile && onCollapse(true);
    };

    getMenus = menus =>
        menus.map((menu, i) => {
            if (!menu.child || menu.child.length == 0) {
                return (
                    <Menu.Item key={'menu' + menu.id}>
                        <Link
                            to={menu.router}
                            target={undefined}
                            replace={menu.router === this.props.location.pathname}

                        >
                            {<span>{menu.icon && <Icon type={menu.icon}/>}<span className="nav-menu-text">{menu.name}</span></span>}
                        </Link>
                    </Menu.Item>
                );
            }
            return (
                <SubMenu
                    key={'sub' + menu.id}
                    title={<span>{menu.icon && <Icon type={menu.icon} />}<span className="nav-sub-text">{menu.name}</span></span>}
                >
                    {this.getMenus(menu.child)}
                </SubMenu>
            );
        })

    componentWillReceiveProps(nextProps) {
        if (nextProps.location && this.props.location && (nextProps.location.pathname != this.props.location.pathname)) {
            this.setState({
                openKeys: this.getDefaultOpenKeys(nextProps),
            });
        }
    }

    render() {
        console.log('SiderMenu');
        const {
            menus,
            collapsed,
            location,
            logo,
            onCollapse,
        } = this.props;

        const { openKeys } = this.state;

        const menuProps = collapsed ? {} : {
            openKeys,
        };

        let activeKey = '';
        let current = getCurrentMenu(location.pathname);
        if (current) {
            activeKey = 'menu' + current.id;
        }
        return (
            <Sider
                trigger={null}
                collapsible
                breakpoint="lg"
                collapsed={collapsed}
                width={256}
                onCollapse={onCollapse}
                className={styles.sider}
            >
                <div className={styles.logo} key="logo">
                    <Link to="/">
                        <img src={logo} alt="logo" />
                        <h1>瓜子后服务</h1>
                    </Link>
                </div>
                <Menu
                    key="Menu"
                    {...menuProps}
                    mode='inline'
                    theme='dark'
                    selectedKeys={[activeKey]}
                    onOpenChange={this.onOpenChange}
                    onClick={this.menuClickHandle}
                    style={{ padding: '16px 0', width: '100%' }}
                >
                    {this.getMenus(menus, '')}
                </Menu>
            </Sider>
        );
    }
}

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
    location: PropTypes.object,
    menus: PropTypes.array,
    logo: PropTypes.string,
    isMobile: PropTypes.bool,
    onCollapse: PropTypes.func,
};

export default Sidebar;
