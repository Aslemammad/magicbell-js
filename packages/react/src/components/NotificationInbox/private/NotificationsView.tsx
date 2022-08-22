/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useConfig, useNotifications } from '@magicbell/react-headless';
import INotification from '@magicbell/react-headless/dist/types/INotification';
import { pathOr } from 'ramda';
import { Fragment, useState } from 'react';
import { ReactElement } from 'react';

import { useTranslate } from '../../../context/TranslationsContext';
import EnablePushNotificationsBanner from '../../EnablePushNotificationsBanner';
import Footer from '../../Footer';
import Header from '../../Header';
import HeaderTabs, { HeaderTabsProps } from '../../Header/HeaderTabs';
import IconButton from '../../IconButton/IconButton';
import CheckMarkIcon from '../../icons/CheckMarkIcon';
import SettingsIcon from '../../icons/SettingsIcon';
import { ListItemProps } from '../../NotificationList';
import Text from '../../Text';
import ClearInboxMessage from '../ClearInboxMessage';
import Layout from '../Layout';
import { NotificationInboxProps, SetViewHandler } from '../NotificationInbox';
import NotificationInboxContent from '../NotificationInboxContent';

export type NotificationsViewProps = {
  storeId?: string;
  notificationPreferencesEnabled?: boolean;
  setView: SetViewHandler;
  layout: NonNullable<NotificationInboxProps['layout']>;
  height?: number;
  onAllRead?: () => void;
  NotificationItem?: (props: ListItemProps) => ReactElement;
  EmptyInboxPlaceholder?: () => ReactElement;
  onNotificationClick?: (notification: INotification) => void;
  tabs?: HeaderTabsProps['tabsConfig'];
};

export default function NotificationsView({
  layout,
  storeId,
  onNotificationClick,
  onAllRead,
  notificationPreferencesEnabled,
  NotificationItem,
  EmptyInboxPlaceholder = ClearInboxMessage,
  setView,
  tabs: tabsConfig,
}: NotificationsViewProps) {
  const t = useTranslate();
  const config = useConfig();

  const [activeStore, setActiveStore] = useState(storeId || tabsConfig?.[0].storeId);
  const store = useNotifications(activeStore);

  if (!store) return null;

  const hasNotifications = !store.isEmpty;
  const showPreferencesButton =
    notificationPreferencesEnabled ??
    pathOr(true, ['features', 'notificationPreferences', 'enabled'], config.inbox);

  const handleMarkAllAsRead = () => {
    store?.markAllAsRead();
    onAllRead?.();
  };

  const showTabs = tabsConfig && activeStore;
  const tabs = showTabs ? (
    <HeaderTabs activeTab={activeStore} onChange={setActiveStore} tabsConfig={tabsConfig} />
  ) : null;

  const title = <Text id="header.title" defaultMessage="Notifications" />;

  return (
    <Layout order={layout}>
      <Header
        key="header"
        title={showTabs ? tabs : title}
        actions={
          <Fragment>
            {hasNotifications ? (
              <IconButton
                onClick={handleMarkAllAsRead}
                aria-label={t('header.mark-all-read', 'Mark all read')}
              >
                <CheckMarkIcon />
              </IconButton>
            ) : null}

            {showPreferencesButton ? (
              <IconButton
                onClick={() => setView('preferences')}
                aria-label={t('preferences.toggle', 'Notification preferences')}
              >
                <SettingsIcon />
              </IconButton>
            ) : null}
          </Fragment>
        }
      />

      <div key="content" css={{ flex: 1, overflowY: 'hidden' }}>
        {!store.lastFetchedAt ? null : hasNotifications ? (
          <NotificationInboxContent
            store={store}
            onNotificationClick={onNotificationClick}
            NotificationItem={NotificationItem}
          />
        ) : (
          <EmptyInboxPlaceholder />
        )}
      </div>

      <EnablePushNotificationsBanner key="push-notifications-banner" />

      <Footer key="footer" />
    </Layout>
  );
}
