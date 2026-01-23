'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { DirhamSymbol } from '@/components/icons/dirham-symbol'

interface FilterValue {
  id: string
  label: string
  count: number
  input: string
}

interface Filter {
  id: string
  label: string
  type: 'LIST' | 'PRICE_RANGE' | 'BOOLEAN'
  values: FilterValue[]
}

interface ProductFiltersProps {
  filters: Filter[]
  className?: string
}

export function ProductFilters({ filters, className }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [openFilters, setOpenFilters] = useState<Set<string>>(new Set(['price', 'availability']))

  const toggleFilter = useCallback((filterId: string) => {
    setOpenFilters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(filterId)) {
        newSet.delete(filterId)
      } else {
        newSet.add(filterId)
      }
      return newSet
    })
  }, [])

  const updateFilters = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    router.push(`?${params.toString()}`)
  }, [router, searchParams])

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Keep search query and sort, remove all filter params
    const keysToKeep = ['q', 'sort']
    const newParams = new URLSearchParams()
    
    keysToKeep.forEach(key => {
      const value = params.get(key)
      if (value) {
        newParams.set(key, value)
      }
    })
    
    router.push(`?${newParams.toString()}`)
  }, [router, searchParams])

  const getActiveFilterCount = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    const filterKeys = ['price', 'vendor', 'product_type', 'availability', 'tag']
    return filterKeys.filter(key => params.has(key)).length
  }, [searchParams])

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Price Range Filter */}
      <Collapsible
        open={openFilters.has('price')}
        onOpenChange={() => toggleFilter('price')}
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="font-medium">Price Range</span>
          <ChevronDownIcon 
            className={cn(
              'h-4 w-4 transition-transform',
              openFilters.has('price') && 'rotate-180'
            )} 
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          <PriceRangeFilter onUpdate={updateFilters} />
        </CollapsibleContent>
      </Collapsible>

      {/* Availability Filter */}
      <Collapsible
        open={openFilters.has('availability')}
        onOpenChange={() => toggleFilter('availability')}
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="font-medium">Availability</span>
          <ChevronDownIcon 
            className={cn(
              'h-4 w-4 transition-transform',
              openFilters.has('availability') && 'rotate-180'
            )} 
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          <AvailabilityFilter onUpdate={updateFilters} />
        </CollapsibleContent>
      </Collapsible>

      {/* Dynamic Filters from Shopify */}
      {filters.map((filter) => (
        <Collapsible
          key={filter.id}
          open={openFilters.has(filter.id)}
          onOpenChange={() => toggleFilter(filter.id)}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <span className="font-medium">{filter.label}</span>
            <ChevronDownIcon 
              className={cn(
                'h-4 w-4 transition-transform',
                openFilters.has(filter.id) && 'rotate-180'
              )} 
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {filter.type === 'LIST' && (
              <ListFilter
                filter={filter}
                onUpdate={updateFilters}
              />
            )}
            {filter.type === 'PRICE_RANGE' && (
              <PriceRangeFilter onUpdate={updateFilters} />
            )}
            {filter.type === 'BOOLEAN' && (
              <BooleanFilter
                filter={filter}
                onUpdate={updateFilters}
              />
            )}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}

function ListFilter({ 
  filter, 
  onUpdate 
}: { 
  filter: Filter
  onUpdate: (key: string, value: string | null) => void 
}) {
  const searchParams = useSearchParams()
  const currentValue = searchParams.get(filter.id.toLowerCase())

  return (
    <div className="space-y-2">
      {filter.values.map((value) => (
        <div key={value.id} className="flex items-center space-x-2">
          <Checkbox
            id={value.id}
            checked={currentValue === value.input}
            onCheckedChange={(checked) => {
              onUpdate(
                filter.id.toLowerCase(),
                checked ? value.input : null
              )
            }}
          />
          <Label
            htmlFor={value.id}
            className="text-sm font-normal cursor-pointer flex-1"
          >
            {value.label}
            <span className="text-gray-500 ml-1">({value.count})</span>
          </Label>
        </div>
      ))}
    </div>
  )
}

function PriceRangeFilter({ 
  onUpdate 
}: { 
  onUpdate: (key: string, value: string | null) => void 
}) {
  const searchParams = useSearchParams()
  const currentRange = searchParams.get('price')
  const [priceRange, setPriceRange] = useState([0, 1000])

  const handlePriceChange = useCallback((values: number[]) => {
    setPriceRange(values)
    const rangeString = `${values[0]}-${values[1]}`
    onUpdate('price', rangeString)
  }, [onUpdate])

  return (
    <div className="space-y-4">
      <div className="px-2">
        <Slider
          value={priceRange}
          onValueChange={handlePriceChange}
          max={1000}
          min={0}
          step={10}
          className="w-full"
        />
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <DirhamSymbol className="w-3 h-3" />
          {priceRange[0]}
        </span>
        <span className="flex items-center gap-1">
          <DirhamSymbol className="w-3 h-3" />
          {priceRange[1]}
        </span>
      </div>
    </div>
  )
}

function AvailabilityFilter({ 
  onUpdate 
}: { 
  onUpdate: (key: string, value: string | null) => void 
}) {
  const searchParams = useSearchParams()
  const currentValue = searchParams.get('availability')

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="in-stock"
          checked={currentValue === 'true'}
          onCheckedChange={(checked) => {
            onUpdate('availability', checked ? 'true' : null)
          }}
        />
        <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
          In Stock Only
        </Label>
      </div>
    </div>
  )
}

function BooleanFilter({ 
  filter, 
  onUpdate 
}: { 
  filter: Filter
  onUpdate: (key: string, value: string | null) => void 
}) {
  const searchParams = useSearchParams()
  const currentValue = searchParams.get(filter.id.toLowerCase())

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={filter.id}
        checked={currentValue === 'true'}
        onCheckedChange={(checked) => {
          onUpdate(filter.id.toLowerCase(), checked ? 'true' : null)
        }}
      />
      <Label htmlFor={filter.id} className="text-sm font-normal cursor-pointer">
        {filter.label}
      </Label>
    </div>
  )
}