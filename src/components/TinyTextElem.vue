<template>
	<div
		:class="[size == 'small' ? 'text-subtitle-2 font-weight-light' : 'text-subtitle-1', muted ? 'text-blue-grey-lighten-3' : '']">
		<v-icon v-if="icon" :icon="icon"></v-icon> {{ text }}
	</div>
</template>

<script>

export default {
	props: {
		size: {
			type: String,
			default: 'normal'
		},
		icon: {
			type: String,
			default: null
		},
		text: {
			type: String,
			default: 'The tiny text'
		},
		muted: {
			type: Boolean,
			default: false
		}
	}
}

</script>
