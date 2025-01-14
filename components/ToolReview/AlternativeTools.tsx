"use client"

import Image from "next/image"
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card"
import Link from "next/link"
import { Tool as NocoTool } from "@/utils/nocodb"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import ShineBorder from "@/components/magicui/shine-border"

interface AlternativeToolsProps {
  tools: NocoTool[]
  adBanner?: {
    image: string
    link: string
    altText: string
  }
}

export default function AlternativeTools({ tools = [], adBanner }: AlternativeToolsProps) {
  if (!tools || tools.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Ad Banner Section */}
      {adBanner && (
        <div className="rounded-lg overflow-hidden">
          <Link href={adBanner.link}>
            <Image
              src={adBanner.image}
              alt={adBanner.altText}
              width={400}
              height={200}
              className="w-full object-cover"
            />
          </Link>
        </div>
      )}

      {/* Alternative Tools Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Alternative Tools</h2>
        <div className="space-y-4">
          {tools.map((tool) => (
            <Link href={`/tools/${tool.slug}`} key={tool.Id}>
              <ShineBorder
                borderRadius={6}
                duration={14}
                color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                className="w-full"
              >
                <Card className="bg-transparent border-0 hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center gap-4 p-4">
                    {/* Logo avec taille fixe et meilleur rendu */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      {tool.logo ? (
                        <Image
                          src={tool.logo}
                          alt={`${tool.name} logo`}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icons.logo className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-1">
                        {tool.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mb-2">
                        {tool.categories}
                      </Badge>
                      <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </ShineBorder>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 