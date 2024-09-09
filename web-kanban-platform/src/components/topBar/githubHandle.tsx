import React from 'react'

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Button } from "@/components/ui/button";

import { MdOutlineCalendarMonth } from "react-icons/md";

const GithubHandle = () => {
  return (
    <HoverCard>
        <HoverCardTrigger href='https://github.com/CaioRSV' target='_blank'>
            <div className="inline-flex items-center justify-center">
                <div>
                    <Button variant="link" className={`m-2 -mt-3 w-fit`}>
                        @caiorsv
                    </Button>
                </div>
            </div>
        </HoverCardTrigger>
        <HoverCardContent className={`w-80`}>
            <div className="flex justify-between space-x-4">
                <Avatar>
                <AvatarImage src="https://avatars.githubusercontent.com/u/31866855?s=400&u=a8d3ee1b6aac49039450b1826819308bc3222150&v=4" />
                <AvatarFallback>C</AvatarFallback>
                </Avatar>
                <div className={`space-y-1`}>
                <h4 className="text-sm font-semibold">Caio Verçosa</h4>
                <p className="text-sm">
                    Desenvolvedor e discente em Ciência da Computação.
                </p>
                <div className="flex items-center pt-2">
                    <MdOutlineCalendarMonth className="mr-2 h-4 w-4 opacity-70" />{" "}
                    <span className="text-xs text-muted-foreground">
                        Última atualização: 06/09/2024
                    </span>
                </div>
                </div>
            </div>
        </HoverCardContent>
    </HoverCard>
  )
}

export default GithubHandle