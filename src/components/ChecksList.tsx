import {useEffect, useMemo, useRef, useState} from 'react';
import styles from '@/styles/profile/checkList/checksList.module.css';
import {CheckItem} from "@/components/checksList/CheckItem";
import {ContextMenu} from "@/components/ui/profileUI/ContextMenu";
import {CalendarModel} from "@/components/ui/profileUI/CalendarModel";
import Search from "@/components/Search";
import Reference from "@/components/Reference";
import ChangeTheme from "@/components/ChangeTheme";
import {SortControls} from "@/components/ui/profileUI/SortControls";
import { AnimatePresence } from 'framer-motion';
import {useMco} from "@/context/McoContext";
import {useToast} from "@/context/ToastContext";
import {useUser} from "@/context/UserContext";
import {CheckListItem} from "@/components/checksList/CheckListItem";
import {addIdsToReceipts, ReceiptDto} from "@/api/types/typesMcoService";
import { useCheckedItemsContext } from "@/context/CheckedItemsContext";

type MenuState = {
    x: number;
    y: number;
    item: ReceiptDto;
} | null;

interface ChecksListProps {
    mode: string;
}

export default function ChecksList({mode}: ChecksListProps) {
    const [contextMenu, setContextMenu] = useState<MenuState>(null);
    const [isContextMenuVisible, setContextMenuVisible] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { currentUser } = useUser();
    const { bindAndCheck,  userReceipts} = useMco();
    const { showToast } = useToast();
    const { checkedItems, toggleChecksItem, clearCheckedItems, isChecked } = useCheckedItemsContext();

    const handleContextMenuOpen = (item: ReceiptDto, x: number, y: number) => {
        setContextMenu({ x, y, item });
        setContextMenuVisible(true);
    };

    const handleContextMenuClose = () => {
        setContextMenu(null);
        setContextMenuVisible(false);
    };

    const receiptsWithId = useMemo(() => {
        return userReceipts?.content ? addIdsToReceipts(userReceipts.content) : [];
    }, [userReceipts]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsCalendarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.cheksList}>
            <header className={styles.header}>
                <div className={styles.header__left}>
                    <Search/>
                </div>
                <div className={styles.header__right}>
                    <Reference/>
                    <ChangeTheme/>
                </div>
            </header>
            <main className={styles.mainCheckList}>
                <div className={styles.leftBoxCheckList}>
                    {!currentUser?.partnerConnected ? (
                        <div className={styles.noAccess}>
                            <div className={styles.noAccessWrapper}>
                                <p className={styles.noAccessText}>Чтобы увидеть чеки, выдайте доступ</p>
                                <button
                                    type="button"
                                    className={styles.noAccessBtn}
                                    onClick={async () => {
                                        if (!currentUser?.phoneNumber) return;

                                        const result = await bindAndCheck(currentUser.phoneNumber);
                                        if (result) {
                                            showToast("success", "Запрос успешно отправлен");
                                            window.open("https://dr.stm-labs.ru/partners", "_blank", "noopener,noreferrer");
                                        }
                                        else {
                                            showToast("danger", "Пользователь уже подключен");
                                        }
                                    }}
                                >
                                    Выдать доступ
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.top}>
                                <button
                                    className={styles.calendar}
                                    type="button"
                                    onClick={() => setIsCalendarOpen(prev => !prev)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M3.9375 0C4.08668 0 4.22976 0.0592632 4.33525 0.164752C4.44074 0.270242 4.5 0.413316 4.5 0.5625V1.125H13.5V0.5625C13.5 0.413316 13.5593 0.270242 13.6648 0.164752C13.7702 0.0592632 13.9133 0 14.0625 0C14.2117 0 14.3548 0.0592632 14.4602 0.164752C14.5657 0.270242 14.625 0.413316 14.625 0.5625V1.125H15.75C16.3467 1.125 16.919 1.36205 17.341 1.78401C17.7629 2.20597 18 2.77826 18 3.375V15.75C18 16.3467 17.7629 16.919 17.341 17.341C16.919 17.7629 16.3467 18 15.75 18H2.25C1.65326 18 1.08097 17.7629 0.65901 17.341C0.237053 16.919 0 16.3467 0 15.75V3.375C0 2.77826 0.237053 2.20597 0.65901 1.78401C1.08097 1.36205 1.65326 1.125 2.25 1.125H3.375V0.5625C3.375 0.413316 3.43426 0.270242 3.53975 0.164752C3.64524 0.0592632 3.78832 0 3.9375 0ZM1.125 4.5V15.75C1.125 16.0484 1.24353 16.3345 1.4545 16.5455C1.66548 16.7565 1.95163 16.875 2.25 16.875H15.75C16.0484 16.875 16.3345 16.7565 16.5455 16.5455C16.7565 16.3345 16.875 16.0484 16.875 15.75V4.5H1.125Z" fill="#2E374F"/>
                                    </svg>
                                </button>

                                <AnimatePresence>
                                    {isCalendarOpen && (
                                        <CalendarModel/>
                                    )}
                                </AnimatePresence>
                                {<SortControls /> }
                                <div className={styles.stub}/>
                            </div>
                            <div className={styles.list}>
                                {receiptsWithId.map((item, index) => (
                                    <CheckListItem
                                        key={item.id}
                                        id={index}
                                        item={item}
                                        onContextMenuOpen={handleContextMenuOpen}
                                    />
                                ))}
                                {/*{hasMore && (*/}
                                {/*    <button*/}
                                {/*        disabled={isLoading}*/}
                                {/*        onClick={() => loadItems(false)}*/}
                                {/*        className={styles.loadMoreBtn}*/}
                                {/*    >*/}
                                {/*        {isLoading ? "Загрузка..." : "Загрузить ещё"}*/}
                                {/*    </button>*/}
                                {/*)}*/}
                            </div>
                        </>
                    )}

                </div>
                <CheckItem
                    items={checkedItems} // Всегда передаем все выбранные чеки
                    item={checkedItems.length === 1 ? checkedItems[0] : undefined}
                    onRemove={clearCheckedItems}
                    mode={mode}
                />
            </main>
            {contextMenu && contextMenu.item && (
                <ContextMenu
                    isVisible={isContextMenuVisible}
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={handleContextMenuClose}
                    actions={[
                        {
                            label: isChecked(contextMenu.item) ? 'Снять выбор' : 'Выбрать',
                            onClick: () => {
                                toggleChecksItem(contextMenu.item);
                                handleContextMenuClose();
                            },
                        },
                        {
                            label: "Скачать",
                            onClick: () => {
                                handleContextMenuClose();
                            },
                        }
                    ]}
                />
            )}
        </div>
    );
}