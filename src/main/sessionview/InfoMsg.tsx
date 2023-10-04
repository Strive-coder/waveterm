import * as React from "react";
import * as mobxReact from "mobx-react";
import { If, For } from "tsx-control-statements/components";
import cn from "classnames";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { GlobalModel } from "../../model";
import { makeExternLink } from "../../util/util";
import "./sessionview.less";

dayjs.extend(localizedFormat);

@mobxReact.observer
class InfoMsg extends React.Component<{}, {}> {
    getAfterSlash(s: string): string {
        if (s.startsWith("^/")) {
            return s.substr(1);
        }
        let slashIdx = s.lastIndexOf("/");
        if (slashIdx == s.length - 1) {
            slashIdx = s.lastIndexOf("/", slashIdx - 1);
        }
        if (slashIdx == -1) {
            return s;
        }
        return s.substr(slashIdx + 1);
    }

    hasSpace(s: string): boolean {
        return s.indexOf(" ") != -1;
    }

    handleCompClick(s: string): void {
        // TODO -> complete to this completion
    }

    render() {
        let model = GlobalModel;
        let inputModel = model.inputModel;
        let infoMsg = inputModel.infoMsg.get();
        let infoShow = inputModel.infoShow.get();
        let line: string = null;
        let istr: string = null;
        let idx: number = 0;
        let titleStr = null;
        let remoteEditKey = "inforemoteedit";
        if (infoMsg != null) {
            titleStr = infoMsg.infotitle;
        }
        let activeScreen = model.getActiveScreen();
        return (
            <div className="cmd-input-info" style={{ display: infoShow ? "block" : "none" }}>
                <If condition={infoMsg && infoMsg.infotitle != null}>
                    <div key="infotitle" className="info-title">
                        {titleStr}
                    </div>
                </If>
                <If condition={infoMsg && infoMsg.infomsg != null}>
                    <div key="infomsg" className="info-msg">
                        <If condition={infoMsg.infomsghtml}>
                            <span dangerouslySetInnerHTML={{ __html: infoMsg.infomsg }} />
                        </If>
                        <If condition={!infoMsg.infomsghtml}>{infoMsg.infomsg}</If>
                    </div>
                </If>
                <If condition={infoMsg && infoMsg.websharelink && activeScreen != null}>
                    <div key="infomsg" className="info-msg">
                        started sharing screen at{" "}
                        <a target="_blank" href={makeExternLink(activeScreen.getWebShareUrl())}>
                            [link]
                        </a>
                    </div>
                </If>
                <If condition={infoMsg && infoMsg.infolines != null}>
                    <div key="infolines" className="info-lines">
                        <For index="idx" each="line" of={infoMsg.infolines}>
                            <div key={idx}>{line == "" ? " " : line}</div>
                        </For>
                    </div>
                </If>
                <If condition={infoMsg && infoMsg.infocomps != null && infoMsg.infocomps.length > 0}>
                    <div key="infocomps" className="info-comps">
                        <For each="istr" index="idx" of={infoMsg.infocomps}>
                            <div
                                onClick={() => this.handleCompClick(istr)}
                                key={idx}
                                className={cn(
                                    "info-comp",
                                    { "has-space": this.hasSpace(istr) },
                                    { "metacmd-comp": istr.startsWith("^") }
                                )}
                            >
                                {this.getAfterSlash(istr)}
                            </div>
                        </For>
                        <If condition={infoMsg.infocompsmore}>
                            <div key="more" className="info-comp no-select">
                                ...
                            </div>
                        </If>
                    </div>
                </If>
                <If condition={infoMsg && infoMsg.infoerror != null}>
                    <div key="infoerror" className="info-error">
                        [error] {infoMsg.infoerror}
                    </div>
                </If>
            </div>
        );
    }
}

export { InfoMsg };