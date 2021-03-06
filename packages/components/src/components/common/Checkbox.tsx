import React, { useRef } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { Platform } from '../../libs/platform'
import { contentPadding } from '../../styles/variables'
import { ThemedIcon, ThemedIconProps } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

const checkboxBorderRadius = 4

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    position: 'relative',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export interface CheckboxProps {
  analyticsLabel: TouchableOpacityProps['analyticsLabel']
  checked?: boolean | null
  circle?: boolean
  containerStyle?: ViewStyle
  defaultValue?: boolean | null
  disabled?: boolean
  enableIndeterminateState?: boolean
  label?: string | React.ReactNode
  labelIcon?: ThemedIconProps['name']
  labelTooltip?: string
  onChange?: (value: boolean | null) => void
  size?: number
  squareContainerStyle?: ViewStyle
  useBrandColor?: boolean

  checkedBackgroundThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
  checkedForegroundThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
  uncheckedBackgroundThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
  uncheckedForegroundThemeColor?:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string)
}

export function Checkbox(props: CheckboxProps) {
  const {
    defaultValue,
    checked = defaultValue,

    analyticsLabel,
    squareContainerStyle,
    circle,
    containerStyle,
    disabled,
    enableIndeterminateState = false,
    label,
    labelIcon,
    labelTooltip,
    onChange,
    size = 16,

    checkedBackgroundThemeColor = 'primaryBackgroundColor',
    checkedForegroundThemeColor = 'primaryForegroundColor',
    uncheckedBackgroundThemeColor,
    uncheckedForegroundThemeColor = 'foregroundColor',
  } = props

  const lastBooleanRef = useRef(
    typeof props.checked === 'boolean'
      ? props.checked
      : enableIndeterminateState
      ? !defaultValue
      : !!defaultValue,
  )

  const isIndeterminateState = enableIndeterminateState && checked === null

  const getNextValue = () =>
    enableIndeterminateState
      ? checked === null
        ? !lastBooleanRef.current
        : null
      : !checked

  const handleOnChange = () => {
    if (!onChange) return

    const nextValue = getNextValue()

    if (typeof nextValue === 'boolean') {
      lastBooleanRef.current = nextValue
    }

    setTimeout(() => {
      onChange(nextValue)
    }, 1)
  }

  const borderWidth = 1

  return (
    <TouchableOpacity
      analyticsAction={
        isIndeterminateState ? 'indeterminate' : checked ? 'uncheck' : 'check'
      }
      analyticsCategory="checkbox"
      analyticsLabel={analyticsLabel}
      disabled={disabled}
      onPress={disabled ? undefined : handleOnChange}
      style={[styles.container, containerStyle]}
    >
      <View
        style={[
          styles.checkboxContainer,
          {
            width: size,
            height: size,
            borderRadius: circle ? size / 2 : checkboxBorderRadius,
          },
          squareContainerStyle,
        ]}
      >
        <ThemedView
          borderColor={
            checked || isIndeterminateState
              ? checkedBackgroundThemeColor
              : uncheckedForegroundThemeColor
          }
          style={[
            styles.checkbox,
            {
              width: size,
              height: size,
              borderWidth,
              borderRadius: circle ? size / 2 : checkboxBorderRadius,
            },
          ]}
        >
          <View
            collapsable={false}
            style={[StyleSheet.absoluteFill, styles.center, { zIndex: 1 }]}
          >
            <ThemedView
              backgroundColor={
                checked || isIndeterminateState
                  ? checkedBackgroundThemeColor
                  : uncheckedBackgroundThemeColor
              }
              style={{
                width: Math.floor(
                  (isIndeterminateState ? size * 0.8 : size) - 2 * borderWidth,
                ),
                height: Math.floor(
                  (isIndeterminateState ? size * 0.8 : size) - 2 * borderWidth,
                ),
                borderRadius: circle ? size / 2 : checkboxBorderRadius / 2,
              }}
            />
          </View>

          <View
            collapsable={false}
            style={[StyleSheet.absoluteFill, styles.center, { zIndex: 2 }]}
          >
            <ThemedIcon
              color={checkedForegroundThemeColor}
              name="check"
              size={size - 3}
              style={{
                lineHeight: size - 3,
                paddingLeft: Platform.OS === 'android' ? 0 : 1,
                paddingTop: Platform.OS === 'ios' ? 1 : 0,
                paddingBottom: Platform.OS === 'android' ? 1 : 0,
                textAlign: 'center',
                opacity: checked ? 1 : 0,
              }}
            />
          </View>
        </ThemedView>
      </View>

      {!!label && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'space-between',
          }}
        >
          {typeof label === 'string' ? (
            <ThemedText
              color="foregroundColor"
              style={{
                lineHeight: size,
                marginLeft: contentPadding / 2,
              }}
              {...!!labelTooltip &&
                Platform.select({
                  web: { title: labelTooltip },
                })}
            >
              {label}
            </ThemedText>
          ) : (
            label
          )}

          {!!labelIcon && (
            <ThemedIcon
              color="foregroundColor"
              name={labelIcon}
              size={16}
              style={{ lineHeight: 16 }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}
