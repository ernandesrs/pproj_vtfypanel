<template>
	<div class="text-center py-5">
		<v-progress-circular indeterminate size="45" color="secondary"></v-progress-circular>
		<div v-if="text" class="text-h6 text-lg-h5 text-grey-lighten-4 text-shadow-drop-center pt-2">{{ text }}</div>
	</div>
</template>

<script>

export default {
	data() {
		return {
		}
	},
	props: {
		text: {
			type: String,
			default: null
		}
	}
}

</script>

<style>
.text-shadow-drop-center {
	-webkit-animation: text-shadow-drop-center 0.5s infinite alternate both;
	animation: text-shadow-drop-center 0.5s infinite alternate both;
}

/* ----------------------------------------------
 * Generated by Animista on 2023-6-28 10:56:21
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * @animation text-shadow-drop-center
 * ----------------------------------------
 */
@-webkit-keyframes text-shadow-drop-center {
	0% {
		text-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
	}

	100% {
		text-shadow: 0 6px 0 rgba(0, 0, 0, 0.75);
	}
}

@keyframes text-shadow-drop-center {
	0% {
		text-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
	}

	100% {
		text-shadow: 0 0 8px rgba(0, 0, 0, 0.75);
	}
}
</style>